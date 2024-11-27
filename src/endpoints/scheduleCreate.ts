import {Bool, OpenAPIRoute, Num, Str} from "chanfana";
import {z} from "zod";
import {Context} from "hono"
import {Schedule, ScheduleType} from "../types";
import {DrizzleD1Database} from "drizzle-orm/d1";
import {schedules} from "../schemas/schedules.schema";

export class ScheduleCreate extends OpenAPIRoute {
  schema = {
    tags: ["Schedules"],
    summary: "Create a new Schedule",
    request: {
      body: {
        content: {
          "application/json": {
            schema: Schedule.omit({
              key: true,
              id: true
            }),
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Returns the created schedule",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              code: Num(),
              message: Str(),
              data: Schedule.pick({
                id: true,
                name: true,
                remark: true,
                type: true,
                enabled: true
              }),
            }),
          },
        },
      },
    },
  };

  async handle(c: Context) {
    // Get validated data
    const data = await this.getValidatedData<typeof this.schema>();

    // Retrieve the validated request body
    const scheduleToCreate: ScheduleType = data.body

    const db: DrizzleD1Database = c.var.db

    const key: string = c.var.key

    const [inserted] = await db.insert(schedules)
            .values({
              ...scheduleToCreate,
              key,
            })
            .returning({
              id: schedules.id,
              name: schedules.name,
              remark: schedules.remark,
              type: schedules.type,
              enabled: schedules.enabled,
            })

    // return the new schedule
    return {
      success: true,
      data: {
        id: inserted.id,
        name: inserted.name,
        remark: inserted.remark,
        type: inserted.type,
        enabled: inserted.enabled
      },
    };
  }
}
