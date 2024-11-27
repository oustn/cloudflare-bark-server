CREATE TABLE `schedules` (
	`id` text PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`type` text DEFAULT 'daily' NOT NULL,
	`weekDay` integer DEFAULT false,
	`at` text DEFAULT '00:00' NOT NULL,
	`in` text DEFAULT '[]' NOT NULL,
	`custom` text,
	`payload` text NOT NULL,
	`enabled` integer DEFAULT true
);
