import {
  createExecutionContext,
  waitOnExecutionContext,
  SELF,
  env
} from 'cloudflare:test';
import {describe, it, expect, beforeAll} from 'vitest';
import worker from '../src/index';
import {initDB} from "./helpers/db"

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('Basic info routes', () => {
  beforeAll(async () => {
    return initDB(env.DB)
  })

  it('check register info fail while no data with multiple mode', async () => {
    const request = new IncomingRequest('https://example.com/register/test');
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
    const data: { message: string; code: number } = await response.json()
    expect(data.code).toBe(400)
    expect(data.message).contain('[test]')
  });
})