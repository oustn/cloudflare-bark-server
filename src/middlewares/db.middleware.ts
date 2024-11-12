import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'
import {Context} from 'hono'
import {drizzle, DrizzleD1Database} from "drizzle-orm/d1";

export const dbMiddleware = createMiddleware<{
    Variables: {
        db?: DrizzleD1Database
    },
}>(async (c: Context, next) => {
    const serverless: boolean = c.get("serverless")
    if (serverless) {
        await next()
        return
    }
    if (!c.env.DB) {
        throw new HTTPException(400, { message: "D1 database binding not found" })
    }
    const db = drizzle(c.env.DB);
    c.set('db', db)
    await next()
});
