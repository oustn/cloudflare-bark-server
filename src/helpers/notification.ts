import {Context} from "hono"
import {HTTPException} from "hono/http-exception"
import {Notification} from '@oustn/cloudflare-apns2'
import {Payload, type Sound} from "./builder"
import {DrizzleD1Database} from "drizzle-orm/d1";
import {devices} from "../schemas/devices.schema";
import {eq} from "drizzle-orm";

function transform(params: Record<string, unknown>): Record<string, unknown> {
  const payload = new Payload()
  for (const [key, value] of Object.entries(params)) {
    switch (key) {
      case 'category':
        payload.category(decodeURIComponent(value as string))
        break
      case 'title':
        payload.alertTitle(decodeURIComponent(value as string))
        break
      case 'body':
        payload.alertBody(decodeURIComponent(value as string))
        break
      case 'group':
        payload.threadID(decodeURIComponent(value as string))
        payload.custom(key, value)
        break
      case 'sound':
        if (typeof value === 'string') {
          payload.sound({name: `${value}${!value.includes('.caf') ? '.caf' : ''}`})
          break
        }
        payload.sound(value as Sound)
        break
      case 'device_key':
        continue
      default:
        payload.custom(key.toLowerCase(), value)
    }
  }

  payload.mutableContent()

  return payload.get()
}

export async function resolveNotification(c: Context, body: Record<string, unknown>) {
  const params: Record<string, unknown> = {
    category: 'myNotificationCategory',
    body: 'NoContent',
    sound: '1107',
    ...c.req.param(),
    ...c.req.query(),
  }

  const formBody = await c.req.parseBody()

  Object.assign(params, formBody)

  if (typeof body === 'object' && body) {
    Object.assign(params, body)
  }

  const {device_key: deviceKey, ...rest} = params

  const key: string = c.var.key
  const deviceToken: string = c.var.deviceToken
  const serverless: boolean = c.var.serverless

  let token = serverless ? deviceToken : null
  if (serverless && key !== deviceKey) {
    token = null
  } else if (!serverless && deviceKey) {
    const db: DrizzleD1Database = c.var.db
    const device = await db.select().from(devices)
            .where(eq(devices.key, deviceKey as string))
            .get()
    token = device?.token ?? null
  }

  if (!token) {
    throw new HTTPException(400, {message: `failed to get device token: failed to get [${deviceKey}] device token from database`})
  }
  return new Notification(token, transform(rest))
}
