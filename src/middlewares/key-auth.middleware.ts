import {createMiddleware} from 'hono/factory'
import {HTTPException} from 'hono/http-exception'
import {Context} from 'hono'
import {drizzle, DrizzleD1Database} from "drizzle-orm/d1";
import {devices} from "../schemas/devices.schema";
import {eq} from "drizzle-orm";

function unauthorizedResponse(opts: {
  ctx: Context
  error: string
  errDescription: string
  statusText?: string
}) {
  return new Response('Unauthorized', {
    status: 401,
    statusText: opts.statusText,
    headers: {
      'WWW-Authenticate': `Bearer realm="${opts.ctx.req.url}",error="${opts.error}",error_description="${opts.errDescription}"`,
    },
  })
}

export const keyAuthMiddleware = createMiddleware<{
  Variables: {
    serverless: boolean;
    key?: string;
    deviceToken?: string;
    persist: boolean;
  },
}>(async (c: Context, next) => {
  const db: DrizzleD1Database = c.var.db

  if (!db) {
    throw new HTTPException(400, {message: "D1 database binding not found"})
  }

  const credentials = c.req.header("Authorization")
  let token: string
  if (credentials) {
    const parts = credentials.split(/\s+/)
    if (parts.length !== 2) {
      const errDescription = 'invalid credentials structure'
      throw new HTTPException(401, {
        message: errDescription,
        res: unauthorizedResponse({
          ctx: c,
          error: 'invalid_request',
          errDescription,
        }),
      })
    } else {
      token = parts[1]
    }
  }

  if (!token) {
    const errDescription = 'no authorization included in request'
    throw new HTTPException(401, {
      message: errDescription,
      res: unauthorizedResponse({
        ctx: c,
        error: 'invalid_request',
        errDescription,
      }),
    })
  }

  const device = await db.select().from(devices)
    .where(eq(devices.key, token))
    .get()

  if (!device) {
    throw new HTTPException(401, {
      message: 'Unauthorized',
      res: unauthorizedResponse({
        ctx: c,
        error: 'invalid_token',
        statusText: 'Unauthorized',
        errDescription: 'token verification failure',
      }),
      cause: new Error(`device not found for key ${token}`),
    })
  }
  c.set('key', token)
  await next()
})
