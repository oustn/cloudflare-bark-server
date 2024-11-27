PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_schedules` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`remark` text,
	`key` text DEFAULT '' NOT NULL,
	`type` text DEFAULT 'daily' NOT NULL,
	`weekDay` integer DEFAULT false,
	`at` text DEFAULT '00:00' NOT NULL,
	`in` text DEFAULT '[]' NOT NULL,
	`custom` text,
	`payload` text DEFAULT '{}' NOT NULL,
	`enabled` integer DEFAULT true
);
--> statement-breakpoint
INSERT INTO `__new_schedules`("id", "name", "remark", "key", "type", "weekDay", "at", "in", "custom", "payload", "enabled") SELECT "id", "name", "remark", "key", "type", "weekDay", "at", "in", "custom", "payload", "enabled" FROM `schedules`;--> statement-breakpoint
DROP TABLE `schedules`;--> statement-breakpoint
ALTER TABLE `__new_schedules` RENAME TO `schedules`;--> statement-breakpoint
PRAGMA foreign_keys=ON;