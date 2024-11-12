import {OpenAPIRoute} from "chanfana";
import {Context} from "hono"
import {z} from "zod";

import {resolveDevice} from "../helpers";

export class CheckEndpoint extends OpenAPIRoute {
  schema = {
    tags: ["Bark"],
    summary: "Check device with key",
    request: {
      params: z.object({
        key: z.string().describe('Register key'),
      })
    },
    responses: {
      "200": {
        description: "Return pong",
        content: {
          "application/json": {
            schema: z.object({
              message: z.string(),
              code: z.number(),
              timestamp: z.number(),
            }),
          },
        },
      },
    },
  };

  async handle(c: Context) {
    await this.getValidatedData<typeof this.schema>();
    const device = await resolveDevice(c)

    if (!device.token) {
      return c.json(`failed to get [${device.key}] device token from database`, 400)
    }
    return c.json(null)
  }
}
