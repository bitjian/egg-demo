'use strict';

const assert = require('assert');
const http = require('http');
const mock = require('egg-mock');
const startSingle = require('egg-coral-base/single');

function request(port, path) {
  return new Promise((resolve, reject) => {
    const req = http.get({ host: '127.0.0.1', port, path, agent: false }, res => {
      let text = '';
      res.on('data', chunk => { text += chunk; });
      res.on('error', reject);
      res.on('end', () => {
        let body = text;
        try { body = JSON.parse(text); } catch (_) { /* Non-JSON responses are expected. */ }
        resolve({ status: res.statusCode, headers: res.headers, body });
      });
    });
    req.setTimeout(5000, () => req.destroy(new Error('Request timed out')));
    req.on('error', reject);
  });
}

for (const mode of [ 'multi-process', 'single-process' ]) {
  describe(`demo routes: ${mode}`, () => {
    let cluster;
    let single;
    let port;
    const previousEnv = {};

    before(async () => {
      for (const key of [ 'EGG_SINGLE_PROCESS', 'EGG_SERVER_ENV' ]) {
        previousEnv[key] = process.env[key];
      }
      if (mode === 'multi-process') {
        cluster = mock.cluster({ baseDir: process.cwd(), workers: 2, coverage: false, cache: false });
        await cluster.ready();
        port = cluster.port;
      } else {
        single = await startSingle({ baseDir: process.cwd(), host: '127.0.0.1', port: 0, env: 'unittest' });
        port = single.port;
      }
    });

    after(async () => {
      try {
        if (cluster) await cluster.close();
        if (single) {
          await new Promise((resolve, reject) => {
            single.server.close(err => (err ? reject(err) : resolve()));
          });
          await single.app.close();
        }
      } finally {
        for (const [ key, value ] of Object.entries(previousEnv)) {
          if (value === undefined) delete process.env[key];
          else process.env[key] = value;
        }
      }
    });

    it('keeps the root route outside the v1 group', async () => {
      const res = await request(port, '/');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.mode, mode);
      assert.strictEqual(res.headers['x-route-group'], undefined);
    });

    it('loads the existing directory route', async () => {
      const res = await request(port, '/hello/demo');
      assert.strictEqual(res.status, 200);
      assert.deepStrictEqual(res.body, { hello: 'demo' });
    });

    it('serves the service example without group middleware', async () => {
      const res = await request(port, '/api/users');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.code, 0);
      assert.strictEqual(res.body.data.length, 2);
      assert.strictEqual(res.headers['x-route-group'], undefined);
    });

    it('applies v1 namespace middleware to ping', async () => {
      const res = await request(port, '/v1/ping');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body, 'pong');
      assert.strictEqual(res.headers['x-route-group'], 'v1');
    });

    it('applies v1 namespace middleware to time', async () => {
      const res = await request(port, '/v1/time');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.code, 0);
      assert(Number.isFinite(Date.parse(res.body.data.now)));
      assert.strictEqual(res.headers['x-route-group'], 'v1');
    });

    it('does not expose unprefixed group routes', async () => {
      assert.strictEqual((await request(port, '/ping')).status, 404);
    });

    it('serves the helper example', async () => {
      const res = await request(port, '/api/helper-demo');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.code, 0);
    });

    it('preserves missing-parameter error handling', async () => {
      assert.strictEqual((await request(port, '/api/error-demo')).status, 400);
    });

    it('serves the valid error-handling example', async () => {
      const res = await request(port, '/api/error-demo?id=5');
      assert.strictEqual(res.status, 200);
      assert.deepStrictEqual(res.body, { code: 0, data: { id: 5, square: 25 } });
    });

    for (const name of [ 'db', 'redis' ]) {
      it(`keeps ${name} optional when not configured`, async () => {
        const res = await request(port, `/api/${name}-demo`);
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.code, 1);
        assert.match(res.body.msg, /未启用/);
      });
    }

    it('blocks loopback requests through safeCurl', async () => {
      const res = await request(port, `/api/safecurl-demo?url=${encodeURIComponent(`http://127.0.0.1:${port}/`)}`);
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.code, 1);
      assert.match(res.body.msg, /illegal address/);
    });
  });
}
