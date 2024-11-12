CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`token` text NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`category` text NOT NULL,
	`payload` text NOT NULL,
	`timestamp` integer NOT NULL
);
