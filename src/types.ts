import {Str, Num, Bool, Enumeration} from "chanfana";
import {z} from "zod";

import { schedules } from "./schemas/schedules.schema"

export const Device = z.object({
  id: Str({example: "tz4a98xxAt96iws9zmo1r3j3a"}),
  token: Str({example: "0521441257845151564545"}),
  key: Str({example: "kON2vDisBin2dosYk2"}),
  deleted: Num({example: 0})
});

export const Message = z.object({
  id: Str({example: "tz4a98xxAt96iws9zmo1r3j3a"}),
  token: Str({example: "0521441257845151564545"}),
  title: Str({example: "Hello, World!"}),
  body: Str({example: "This is a test message."}),
  category: Str({example: "test"}),
  payload: Str({example: "This is a test payload."}),
  timestamp: Num({example: 1620000000000})
})

export const Schedule = z.object({
  id: Str({example: "tz4a98xxAt96iws9zmo1r3j3a", required: false}),
  name: Str({ example: "通知关闭订阅"}),
  remark: Str({example: "通知关闭订阅"}).optional(),
  key: Str({example: "kON2vDisBin2dosYk2"}),
  type: Enumeration({
    example: "daily",
    values: ["daily", "hourly", "weekly", "monthly", "custom"]
  }),
  weekend: Bool({example: false, required: false}),
  at: Str({example: "00:00"}),
  in: z.array(Str({example: "00"})),
  custom: z.object({
    type: Enumeration({
      example: "daily",
      values: ["daily", "weekly", "monthly"]
    }),
    duration: Num({example: 1}).int().gte(1),
    before: Num({example: 1732530526514}).int(),
    after: Num({example: 1732530526514}).int()
  }).optional(),
  payload: z.object({
    title: Str({example: "Hello, World!"}).optional(),
    body: Str({example: "This is a test message."}).optional(),
    icon: Str({example: "icon.png"}).optional(),
    sound: Str({example: "sound.mp3"}).optional(),
    category: Str({example: "test"}).optional(),
    call: Bool({example: false}).optional(),
    archive: Bool({example: false}).optional(),
    level: Enumeration({
      example: "active",
      values: ["critical", "passive", "active", "time-sensitive"]
    }).optional(),
    url: Str({example: "https://example.com"}).optional(),
    copy: Str({example: "This is a test copy."}).optional(),
    badge: Num({example: 1}).int().optional(),
    autoCopy: Bool({example: false}).optional()
  }).partial(),
  enabled: Bool({example: false})
})

export type ScheduleType = z.infer<typeof Schedule>
