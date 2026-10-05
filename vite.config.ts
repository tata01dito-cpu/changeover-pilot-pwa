import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" keeps the PWA deployable under any sub-path (GitHub Pages, Netlify, Vercel...).
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: { target: "es2020", sourcemap: false },
});
