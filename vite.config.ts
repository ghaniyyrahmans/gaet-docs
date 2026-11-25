import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

const buildTime = new Date();

export default defineConfig({
  plugins: [sveltekit()],
  define: {
    __BUILD_DATE__: JSON.stringify(buildTime.toISOString().slice(0, 10)),
  },
});
