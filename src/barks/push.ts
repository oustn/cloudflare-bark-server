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
  if (!push) {
    params['device_key'] = z.string().describe('Device key')
  }
  if (title) {
    params['title'] = titleSchema
  }
  if (body) {
    params['body'] = bodySchema
  }
  if (category) {
    params['category'] = categorySchema
  }

  class PushEndpoint extends OpenAPIRoute {
    static name = `${get ? 'get' : (push ? 'push' : 'post')}${title ? '_title' : ''}${body ? '_body' : ''}${category ? '_category' : ''}_PushEndpoint`

    schema = {
      tags: ["Bark"],
      summary: "Push notification endpoint",
      request: {
        params: z.object(params)
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
      const notification = await resolveNotification(c)

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
        return c.json({ message: `push failed: ${e?.reason ?? e?.message ?? JSON.stringify(e)}`, data: notification.buildApnsOptions() }, 500)
      }
    }
  }

  return PushEndpoint
}
