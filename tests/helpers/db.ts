export async function initDB(db: D1Database) {
  await db.prepare(`
CREATE TABLE \`devices\` (
\t\`id\` text PRIMARY KEY NOT NULL,
\t\`token\` text NOT NULL,
\t\`key\` text NOT NULL,
\t\`deleted\` integer DEFAULT 0
);
--> statement-breakpoint
CREATE UNIQUE INDEX \`devices_key_unique\` ON \`devices\` (\`key\`);

CREATE TABLE \`messages\`
(
  \`id\`        text PRIMARY KEY NOT NULL,
  \`token\`     text             NOT NULL,
  \`title\`     text             NOT NULL,
  \`body\`      text             NOT NULL,
  \`category\`  text             NOT NULL,
  \`payload\`   text             NOT NULL,
  \`timestamp\` integer          NOT NULL
);
    `).run()
}
