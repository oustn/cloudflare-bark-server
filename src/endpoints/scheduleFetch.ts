import {Bool, Num, OpenAPIRoute, Str} from "chanfana";
import {z} from "zod";
import {Schedule} from "../types";
import {DrizzleD1Database} from "drizzle-orm/d1";
import {schedules} from "../schemas/schedules.schema";
import {and, eq} from "drizzle-orm";

export class ScheduleFetch extends OpenAPIRoute {
  schema = {
    tags: ["Schedules"],
    summary: "Get a single Schedule by id",
    request: {
      params: z.object({
        id: Str({description: "Schedule id"}),
      }),
    },
    responses: {
      "200": {
        description: "Returns a single schedule if found",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              code: Num(),
              message: Str(),
              data: Schedule.omit({key: true}),
            }),
          },
        },
      },
      "404": {
        description: "Schedule not found",
        content: {
          "application/json": {
            schema: z.object({
              success: Bool(),
              code: Num(),
              message: Str(),
            }),
          },
        },
      },
    },
  };

  async handle(c) {
    // Get validated data
    const data = await this.getValidatedData<typeof this.schema>();

    // Retrieve the validated slug
    const {id} = data.params;

    const db: DrizzleD1Database = c.var.db

    const key: string = c.var.key

    const schedule = await db.select().from(schedules)
            .where(
                    and(
                            eq(schedules.id, id),
                            eq(schedules.key, key))
            )
            .get()

    // @ts-ignore: check if the object exists
    if (!schedule) {
      return Response.json(
              {
                success: false,
                message: "Schedule not found",
                data: null
              },
              {
                status: 404,
              },
      );
    }

    if (schedule) {
      Reflect.deleteProperty(schedule, 'key')
    }

    return {
      success: true,
      data: schedule,
    };
  }
}
