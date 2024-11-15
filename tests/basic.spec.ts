import { createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect, vi } from 'vitest';
import worker from '../src/index';
import { env, serverlessEnv } from "./helpers/env"
import * as middleware from "../src/middlewares"

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('Basic info routes', () => {
  // 1. test info endpoint
  it('ping (unit style)', async () => {
    const dbMiddlewareSpy = vi.spyOn(middleware, 'dbMiddleware');
    const request = new IncomingRequest('https://example.com/ping');
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(dbMiddlewareSpy).not.toHaveBeenCalled();
    expect(await response.json()).toMatchObject({ message: 'pong' });
  });

  it('ping (integration style)', async () => {
    const response = await SELF.fetch('https://example.com/ping');
    expect(await response.json()).toMatchObject({ message: 'pong' });
  });

  // 2. test healthz endpoint
  it('responds with ok (unit style)', async () => {
    const request = new IncomingRequest('https://example.com/healthz');
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(await response.text()).toBe('ok');
  });

  it('responds with ok (integration style)', async () => {
    const response = await SELF.fetch('https://example.com/healthz');
    expect(await response.text()).toBe('ok');
  });

  // 3. test info endpoint
  it('responds with info (unit style)', async () => {
    const request = new IncomingRequest('https://example.com/info');
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    expect(await response.json()).toMatchObject({ serverless: false });
  });

  it('responds with serverless info  (unit style)', async () => {
    const request = new IncomingRequest('https://example.com/info');
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, serverlessEnv, ctx);
    await waitOnExecutionContext(ctx);
    expect(await response.json()).toMatchObject({ serverless: true });
  })

  it('responds with info (integration style)', async () => {
    const response = await SELF.fetch('https://example.com/info');
    expect(await response.json()).toMatchObject({ serverless: false });
  });
});