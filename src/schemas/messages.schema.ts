import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";
import { createId } from '@paralleldrive/cuid2';

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  token: text('token').notNull(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  category: text('category').notNull(),
  payload: text('payload').notNull(),
  timestamp: integer('timestamp').$defaultFn(() => Date.now()).notNull(),
})
