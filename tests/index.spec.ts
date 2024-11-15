// test/index.spec.ts
import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('Bark worker', () => {
  it('responds with swagger doc (unit style)', async () => {
    const request = new IncomingRequest('https://example.com');
    // Create an empty context to pass to `worker.fetch()`.
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    // Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(404)
  });

  it('responds with swagger doc (integration style)', async () => {
    const response = await SELF.fetch('https://example.com');
    expect(response.status).toBe(404)
  });
});
