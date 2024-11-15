import {contentJson, OpenAPIRoute} from "chanfana";
import {Context} from "hono"
import {z} from "zod";

import {resolveNotification, saveMessage} from "../helpers"

import {ApnsClient} from '@oustn/cloudflare-apns2'

const apnsPrivateKey = `-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg4vtC3g5L5HgKGJ2+
T1eA0tOivREvEAY2g+juRXJkYL2gCgYIKoZIzj0DAQehRANCAASmOs3JkSyoGEWZ
sUGxFs/4pw1rIlSV2IC19M8u3G5kq36upOwyFWj9Gi3Ejc9d3sC7+SHRqXrEAJow
8/7tRpV+
-----END PRIVATE KEY-----`

interface PushMeta {
  get?: boolean
  title?: boolean
  body?: boolean
  category?: boolean
  push?: boolean
}

export function resolvePushEndPoint(meta: PushMeta): typeof OpenAPIRoute {
  const {get, push, body, category, title} = meta;

  const titleSchema = z.string().describe('Notification title')
  const bodySchema = z.string().describe('Notification body')
  const categorySchema = z.string().describe('Notification category')

  const params = {}
  const queries = {
    device_key: z.string().describe('Device key').optional().nullable(),
    title: titleSchema.optional().nullable(),
    body: bodySchema.optional().nullable(),
    category: categorySchema.optional().nullable(),
  }
  if (!push) {
    params['device_key'] = z.string().describe('Device key')
    Reflect.deleteProperty(queries, 'device_key')
  }
  if (title) {
    params['title'] = titleSchema
    Reflect.deleteProperty(queries, 'title')
  }
  if (body) {
    params['body'] = bodySchema
    Reflect.deleteProperty(queries, 'body')
  }
  if (category) {
    params['category'] = categorySchema
    Reflect.deleteProperty(queries, 'category')
  }

  const jsonSchema = !get || push ? {
    content: {
      "application/json": {
        schema: z.record(z.string(), z.unknown()).describe("Payload for notification"),
      },
    }
  } : null

  class PushEndpoint extends OpenAPIRoute {
    static name = `${get ? 'get' : (push ? 'push' : 'post')}${title ? '_title' : ''}${body ? '_body' : ''}${category ? '_category' : ''}_PushEndpoint`

    schema = {
      tags: ["Bark"],
      summary: "Push notification endpoint",
      request: {
        params: z.object(params),
        body: jsonSchema,
        query: z.object(queries),
      },
      responses: {
        "200": {
          description: "Return service info",
          ...contentJson({
            version: "v1.0.0",
            arch: "cf",
            serverless: true
          })
        },
      },
    };

    async handle(c: Context) {
      const {body} = await this.getValidatedData<typeof this.schema>();

      const notification = await resolveNotification(c, body)

      const client = new ApnsClient({
        team: '5U8LBRXG3A',
        keyId: 'LH4T9V5U4R',
        signingKey: apnsPrivateKey,
        defaultTopic: 'me.fin.bark',
        requestTimeout: 0,
        pingInterval: 5000
      })

      try {
        await client.send(notification)
        await saveMessage(c, notification)
        return c.json({
          data: notification.buildApnsOptions()
        })
      } catch (e) {
        return c.json({
          message: `push failed: ${e?.reason ?? e?.message ?? JSON.stringify(e)}`,
          data: notification.buildApnsOptions()
        }, 500)
      }
    }
  }

  return PushEndpoint
}
