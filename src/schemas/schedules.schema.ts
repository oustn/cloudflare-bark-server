import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {createId} from '@paralleldrive/cuid2';

export const schedules = sqliteTable("schedules", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").default(''),
  remark: text("remark").default(''),
  // key
  key: text("key").default('').notNull(),
  // 类型
  type: text("type", {
    enum: ["daily", "hourly", "weekly", "monthly", "custom"],
  }).default("daily").notNull(),
  weekend: integer("weekDay", {mode: 'boolean'}).default(false),
  // 每天触发的时间，[day, minute, second]
  at: text("at").default("00:00").notNull(),
  // in hourly: [00, 15, 30, 45]
  // in daily: [12:00, 12:15, 12:30, ....]
  // in weekly: [0, 1, 2, 3, 4, 5, 6]
  // in monthly: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, ....]
  in: text("in", {mode: "json"}).$type<Array<string>>().default([]).notNull(),
  custom: text('custom', {mode: "json"}).$type<{
    type: 'daily' | 'weekly' | 'monthly',
    duration: number,
    before: number | null, // timestamp
    after: number | null,
  }>(),
  payload: text("payload", {mode: "json"}).$type<{
    title?: string
    body?: string
    icon?: string
    sound?: string
    category?: string
    call?: boolean
    archive?: boolean
    level?: string
    url?: string
    copy?: string
    badge?: number
    autoCopy?: boolean
  }>().default({}).notNull(),
  enabled: integer('enabled', {mode: 'boolean'}).default(true),
})
