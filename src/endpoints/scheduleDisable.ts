import {ScheduleUpdate} from "./scheduleUpdate"
import {z} from "zod";
import {Str} from "chanfana";
import {Schedule, ScheduleType} from "../types";

export class ScheduleDisable extends ScheduleUpdate {
  protected getBasicSchema() {
    return {
      summary: "Disable a Schedule",
      request: {
        params: z.object({
          id: Str({description: "Schedule id"}),
        }),
      },
    }
  }

  protected resolveUpdateData(): ScheduleType {
    return {
      enabled: false
    }
  }
}
