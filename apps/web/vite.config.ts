import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [tailwindcss(), svgr(), react()],
  resolve: {
    alias: {
      assets: fileURLToPath(new URL("./src/assets", import.meta.url)),
      components: fileURLToPath(new URL("./src/components", import.meta.url)),
      pages: fileURLToPath(new URL("./src/pages", import.meta.url)),
      constants: fileURLToPath(new URL("./src/constants.ts", import.meta.url)),
      api: fileURLToPath(new URL("./src/api", import.meta.url)),
      utils: fileURLToPath(new URL("./src/utils", import.meta.url)),
    },
  },
});
