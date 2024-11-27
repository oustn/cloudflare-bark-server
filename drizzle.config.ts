import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/schemas/*.schema.ts',
    out: './src/migrations',
    dialect: 'sqlite'
});
