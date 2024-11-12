import {OpenAPIRoute, contentJson} from "chanfana";
import {Context} from "hono"

export class InfoEndpoint extends OpenAPIRoute {
    schema = {
        tags: ["Bark"],
        summary: "Get service info endpoint",
        request: {},
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
        return c.json({
            version: "v2.0.0",
            arch: "cf",
            serverless: c.get("serverless"),
            __pure__: true
        })
    }
}
