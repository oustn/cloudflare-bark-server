import {Bool, Num, OpenAPIRoute, Str} from "chanfana";
import {z} from "zod";
import {Schedule} from "../types";
import { count } from 'drizzle-orm';
import {DrizzleD1Database} from "drizzle-orm/d1";
import {schedules} from "../schemas/schedules.schema";
import {eq} from "drizzle-orm";

export class ScheduleList extends OpenAPIRoute {
  schema = {
    tags: ["Schedules"],
    summary: "List Schedules",
    request: {
      query: z.object({
        page: Num({
          description: "Page number",
          default: 0,
          required: false,
        }),
      }),
    },
    responses: {
      "200": {
        description: "Returns a list of tasks",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              code: Num(),
              message: Str(),
              data: z.object({
                page: Num(),
                limit: Num(),
                total: Num(),
                items: Schedule.pick({
                  id: true,
                  name: true,
                  remark: true,
                  type: true,
                  enabled: true
                }).array()
              }),
            }),
          },
        },
      },
    },
  };

  async handle(c) {
    // Get validated data
    const data = await this.getValidatedData<typeof this.schema>();

    const {page = 0} = data.query;

    const db: DrizzleD1Database = c.var.db
    const key: string = c.var.key

    const limit = 20

    const list = await db.select({
      id: schedules.id,
      name: schedules.name,
      remark: schedules.remark,
      type: schedules.type,
      enabled: schedules.enabled,
    })
            .from(schedules)
            .where(eq(schedules.key, key))
            .limit(limit)
            .offset(page * limit)
            .execute()

    const total = await db.select({ count: count() }).from(schedules)
            .where(eq(schedules.key, key))
            .get()

    return {
      success: true,
      data: {
        items: list,
        page,
        limit,
        total: total.count,
      },
    };
  }
}
