import { OpenAPIRoute } from "chanfana";
import { Context } from "hono"
import { z } from "zod";

export class PingEndpoint extends OpenAPIRoute {
    schema = {
        tags: ["Bark"],
        summary: "Ping bark endpoint",
        request: {
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
        return c.json("pong")
    }
}
