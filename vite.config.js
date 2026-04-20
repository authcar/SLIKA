import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        page2: resolve(__dirname, "filter.html"),
        page3: resolve(__dirname, "room.html"),
        page4: resolve(__dirname, "frame.html"),
      },
    },
  },
});
