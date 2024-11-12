import {createMiddleware} from 'hono/factory';
import {Context} from "hono"

export const barkResponseMiddleware = createMiddleware(async (c: Context, next) => {
    await next()

    if (c.res.headers.get("Content-Type")?.startsWith("application/json")) {
        const obj = await c.res.json();
        const code = c.res.status
        let data: Record<string, unknown> = {
            code,
            message: 'success',
            timestamp: Math.floor(Date.now() / 1000),
        }
        if (typeof obj === "string") {
            data.message = obj
        } else if (typeof obj === "object" && obj) {
            const { __pure__: pure, ...rest } = obj as Record<string, unknown>

            if (!pure) {
                data = {
                    ...data,
                    ...rest
                }
            } else {
                data = rest
            }
        }
        c.res = new Response(JSON.stringify(data), c.res);
    }
})
