import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        page2: resolve(__dirname, "index2.html"),
        page3: resolve(__dirname, "index3.html"),
        page4: resolve(__dirname, "index4.html"),
      },
    },
  },
});
