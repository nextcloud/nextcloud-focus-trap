/// <reference types="vitest" />

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import { fileURLToPath, URL } from "url";
import { dependencies } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), dts()],
  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      name: "@nextcloud/focus-trap",
      fileName: "index",
      formats: ["cjs", "es"],
    },
    rollupOptions: {
      external: Object.keys(dependencies),
    },
  },
  test: {
    globals: true,
    coverage: {
      reporter: ['lcov', 'text'],
    },
    environment: "jsdom",
    alias: {
      "@nextcloud/focus-trap": fileURLToPath(
        new URL("./lib/", import.meta.url)
      ),
    },
  },
});
