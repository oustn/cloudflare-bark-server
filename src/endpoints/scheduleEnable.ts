import { ScheduleUpdate } from "./scheduleUpdate"
import {z} from "zod";
import {Str} from "chanfana";
import {Schedule, ScheduleType} from "../types";
import {Context} from "hono";

export class ScheduleEnable extends ScheduleUpdate {
  protected getBasicSchema() {
    return {
      summary: "Enable a Schedule",
      request: {
        params: z.object({
          id: Str({description: "Schedule id"}),
        }),
      },
    }
  }

  protected resolveUpdateData():ScheduleType {
    return {
      enabled: true
    }
  }
}
