import {Bool, OpenAPIRoute, Num, Str, OpenAPIRouteSchema} from "chanfana";
import {z} from "zod";
import {Context} from "hono"
import {Schedule, ScheduleType} from "../types";
import {DrizzleD1Database} from "drizzle-orm/d1";
import {schedules} from "../schemas/schedules.schema";
import {and, eq} from "drizzle-orm";

export class ScheduleUpdate extends OpenAPIRoute {
  protected getBasicSchema(): OpenAPIRouteSchema {
    return {
      summary: "Update a Schedule",
      request: {
        params: z.object({
          id: Str({description: "Schedule id"}),
        }),
        body: {
          content: {
            "application/json": {
              schema: Schedule.omit({
                key: true,
                id: true,
              }).partial(),
            },
          },
        },
      }
    }
  }

  schema: OpenAPIRouteSchema = {
    ...this.getBasicSchema(),
    tags: ["Schedules"],
    responses: {
      "200": {
        description: "Returns the updated schedule",
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

  protected resolveUpdateData(data: ScheduleType): ScheduleType {
    return data
  }

  async handle(c: Context) {
    // Get validated data
    const data = await this.getValidatedData<typeof this.schema>();

    // Retrieve the validated request body
    const scheduleToCreate = this.resolveUpdateData(data.body)

    console.log(scheduleToCreate, 'xx')

    const {id} = data.params;

    const db: DrizzleD1Database = c.var.db

    const key: string = c.var.key

    const [inserted] = await db.update(schedules)
            .set(scheduleToCreate)
            .where(
                    and(
                            eq(schedules.id, id),
                            eq(schedules.key, key))
            )
            .returning({
              id: schedules.id,
              name: schedules.name,
              remark: schedules.remark,
              type: schedules.type,
              enabled: schedules.enabled,
            })

    // return the new schedule
    return {
      success: !!inserted,
      data: inserted ?? null,
    };
  }
}
