import {Notification} from "@oustn/cloudflare-apns2";
import {Context} from "hono";
import {DrizzleD1Database} from "drizzle-orm/d1";
import {messages} from "../schemas/messages.schema";

export async function saveMessage(ctx: Context, notification: Notification) {
  const persist: boolean = ctx.var.persist
  if (!persist) return
  const db: DrizzleD1Database = ctx.var.db
  if (!db) return

  const message = notification.buildApnsOptions()
  const alert = (message.aps?.alert ?? {}) as { title?: string, body?: string }
  await db.insert(messages)
          .values({
            token: notification.deviceToken,
            title: alert?.title ?? '',
            body: alert?.body ?? '',
            category: message.aps.category as string,
            payload: JSON.stringify(message)
          })
}
