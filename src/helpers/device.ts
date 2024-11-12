import {Context} from "hono"
import {DrizzleD1Database} from "drizzle-orm/d1";
import {eq} from "drizzle-orm";
import { createId } from '@paralleldrive/cuid2';

import {devices} from "../schemas/devices.schema";

export async function resolveDevice(c: Context): Promise<{
  key: string;
  token: string | null;
}> {
  const key: string = c.var.key
  const deviceToken: string = c.var.deviceToken
  const serverless: boolean = c.var.serverless
  const paramKey = c.req.param("key")

  if (serverless && key === paramKey) {
    return {
      key,
      token: deviceToken
    }
  }

  if (serverless) {
    return {
      key: paramKey,
      token: null
    }
  }

  const db: DrizzleD1Database = c.var.db
  const device = await db.select().from(devices)
          .where(eq(devices.key, paramKey))
          .get()
  return {
    key: paramKey,
    token: device?.token || null
  }
}

export async function getDevice<U extends {
  device_key?: string;
  key?: string;
  device_token?: string;
  devicetoken?: string;
}>(c: { query: U, body: U }) {
  const { query, body } = c
  const key = body?.device_key ?? body?.key ?? query?.device_key ?? query?.key
  const token = body?.device_token ?? body?.devicetoken ?? query?.device_token ?? query?.devicetoken
  return {
    key: key || createId(),
    token
  }
}

export function resolveServerlessDevice(c: Context) {
  const key: string = c.var.key
  const deviceToken: string = c.var.deviceToken
  const serverless: boolean = c.var.serverless
  return {
    key: key ?? null,
    token: deviceToken ?? null,
    serverless
  }
}