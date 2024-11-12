import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";
import { createId } from '@paralleldrive/cuid2';

export const devices = sqliteTable("devices", {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    token: text('token').notNull(),
    key: text('key').notNull().unique(),
    deleted: integer('deleted').default(0)
})
