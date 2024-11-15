import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig({
  test: {
    poolOptions: {
      workers: {
        wrangler: { configPath: "./wrangler.test.toml" },
        miniflare: {
          d1Databases: {
            DB: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          },
        },
      },
    },
  },
});
