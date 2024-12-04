import {OpenAPIRoute} from "chanfana";
import {Context} from "hono"
import {z} from "zod";
import {DrizzleD1Database} from "drizzle-orm/d1";
import {and, eq} from "drizzle-orm";

import {getDevice, resolveServerlessDevice} from "../helpers";
import {devices} from "../schemas/devices.schema";

export class RegisterEndpoint extends OpenAPIRoute {
  schema = {
    tags: ["Bark"],
    summary: "Register device",
    request: {
      query: z.object({
        device_key: z.string().describe('Register key').optional().nullable(),
        device_token: z.string().describe('Device token').optional(),
        devicetoken: z.string().describe('Device token').optional(),
        key: z.string().describe('Register key').optional().nullable(),
      }),
      body: {
        content: {
          "application/json": {
            schema: z.object({
              device_key: z.string().describe('Device key').optional().nullable(),
              device_token: z.string().describe('Device token').optional(),
            }),
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Return device registration",
        content: {
          "application/json": {
            schema: z.object({
              message: z.string(),
              timestamp: z.number(),
              code: z.number(),
              data: z.object({
                key: z.string(),
                device_key: z.string(),
                device_token: z.string(),
              })
            }),
          },
        },
      },
    },
  };

  async handle(c: Context) {
    const data = await this.getValidatedData<typeof this.schema>();
    const device = await getDevice(data)

    if (!device.token) {
      return c.json(`device token is empty`, 400)
    }

    const {serverless, key, token} = resolveServerlessDevice(c)

    if (serverless) {
      if (token === device.token) {
        return c.json({
          data: {
            key,
            device_key: key,
            device_token: device.token,
          }
        })
      }
      if (device.token === 'deleted') {
        return c.json({
          data: {
            key,
            device_key: device.key,
            device_token: 'deleted',
          }
        })
      }
      return c.json(`device registration failed: serverless`, 500)
    }

    const db: DrizzleD1Database = c.var.db

    try {
      // 1. first select
      const exist = device.key ? await db.select().from(devices)
              .where(eq(devices.key, device.key))
              .get() : false
      if (exist) {
        await db.update(devices).set({
          token: device.token,
        })
        
        return c.json({
          data: {
            key: device.key,
            device_key: device.key,
            device_token: device.token,
          }
        })
      }
      if (device.token === 'deleted') {
        await db.delete(devices).where(eq(devices.key, device.key))

        return c.json({
          data: {
            key: device.key,
            device_key: device.key,
            device_token: 'deleted',
          }
        })
      }
      const insertedDevice = await db.insert(devices)
              .values({
                key: device.key,
                token: device.token,
              })
              .returning()
      return c.json({
        data: {
          key: insertedDevice[0].key,
          device_key: insertedDevice[0].key,
          device_token: insertedDevice[0].token,
        }
      })
    } catch (e) {
      return c.json(`device registration failed: ${e}`, 500)
    }
  }
}
