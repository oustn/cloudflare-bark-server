import {Bool, Num, OpenAPIRoute, Str} from "chanfana";
import {z} from "zod";
import {Schedule} from "../types";
import {DrizzleD1Database} from "drizzle-orm/d1";
import {schedules} from "../schemas/schedules.schema";
import {eq, and} from "drizzle-orm";

export class ScheduleDelete extends OpenAPIRoute {
  schema = {
    tags: ["Schedules"],
    summary: "Delete a Schedule",
    request: {
      params: z.object({
        id: Str({description: "Schedule id"}),
      }),
    },
    responses: {
      "200": {
        description: "Returns if the schedule was deleted successfully",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              code: Num(),
              message: Str(),
              data: Schedule,
            }),
          },
        },
      },
    },
  };

  async handle(c) {
    // Get validated data
    const data = await this.getValidatedData<typeof this.schema>();

    const db: DrizzleD1Database = c.var.db

    const key: string = c.var.key

    const {id} = data.params;

    const [schedule] = await db.delete(schedules)
            .where(
                    and(
                            eq(schedules.id, id),
                            eq(schedules.key, key))
            ).returning()

    if (schedule) {
      Reflect.deleteProperty(schedule, 'key')
    }
    // Return the deleted task for confirmation
    return {
      success: !!schedule,
      data: schedule ?? null,
    };
  }
}
