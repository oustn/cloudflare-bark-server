CREATE TABLE `devices` (
	`id` text PRIMARY KEY NOT NULL,
	`token` text NOT NULL,
	`key` text NOT NULL,
	`deleted` integer DEFAULT 0
);
--> statement-breakpoint
CREATE UNIQUE INDEX `devices_key_unique` ON `devices` (`key`);