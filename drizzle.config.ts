import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/schemas/*.ts',
    out: './src/migrations',
    dialect: 'sqlite'
});
