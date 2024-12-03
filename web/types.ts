import {z} from "zod";
import {Bool, Enumeration, Num, Str} from "chanfana";

export const NotificationPayload = z.object({
    title: z.string().min(1, "标题不能为空"),
    body: z.string().min(1, "内容不能为空"),
    icon: z.string().optional(),
    sound: z.string().optional(),
    category: z.string().optional(),
    call: z.boolean().optional(),
    archive: z.boolean().optional(),
    level: z.enum(["critical", "passive", "active", "time-sensitive"]).optional(),
    url: z.string().optional(),
    copy: z.string().optional(),
    badge: z.number().optional(),
    autoCopy: z.boolean().optional(),
});

export type NotificationPayloadType = z.infer<typeof NotificationPayload>;

export const Schedule = z.object({
  id: Str().optional(),
  name: Str(),
  remark: Str().optional(),
  key: Str(),
  type: Enumeration({
    values: ["daily", "hourly", "weekly", "monthly", "custom"]
  }),
  weekend: Bool({required: false}),
  at: Str(),
  in: z.array(Str()),
  custom: z.object({
    type: Enumeration({
      example: "daily",
      values: ["daily", "weekly", "monthly"]
    }),
    duration: Num({example: 1}).int().gte(1),
    before: Num({example: 1732530526514}).int(),
    after: Num({example: 1732530526514}).int()
  }).optional(),
  payload: NotificationPayload,
  enabled: Bool()
})

export type ScheduleType = z.infer<typeof Schedule>;

export function createInitialSchedule(): ScheduleType {
  return {
    name: "",
    key: "",
    type: "daily",
    in: [],
    weekend: true,
    payload: {
      title: "",
      body: ""
    },
    at: "",
    enabled: false
  }
}
