import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import { dependencies } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), dts()],
  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      name: "@nextcloud/focus-trap",
      fileName: "index",
      formats: ['cjs', 'es']
    },
    rollupOptions: {
      external: Object.keys(dependencies),
    },
  },
});
