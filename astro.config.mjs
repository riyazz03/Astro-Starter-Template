import { defineConfig } from "astro/config";
import bettercms from "@bettercms-ai/astro";

// astro.config.mjs runs before Vite loads .env, so load it explicitly here.
process.loadEnvFile();

export default defineConfig({
  // reads PUBLIC_BCMS_API_URL + PUBLIC_BCMS_WORKSPACE from your .env
  integrations: [bettercms()],
  output: "server", // required for draft mode + live reads
});