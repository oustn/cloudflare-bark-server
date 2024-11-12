import {createMiddleware} from 'hono/factory'
import {Context} from 'hono'

export const initMiddleware = createMiddleware<{
  Variables: {
    serverless: boolean;
    key?: string;
    deviceToken?: string;
    persist: boolean;
  },
}>(async (c: Context, next) => {
  c.set('serverless', !!c.env.DEVICE_TOKEN && !!c.env.KEY)
  c.set('key', c.env.KEY)
  c.set('deviceToken', c.env.DEVICE_TOKEN)
  c.set('persist', c.env.PERSIST)
  await next()
});
