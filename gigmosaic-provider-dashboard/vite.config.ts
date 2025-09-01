import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    jsx: "automatic",
    logLevel: "silent",
  },
  optimizeDeps: {
    include: ["jwt-decode"],
  },
  server: {
    port: 5173,
    strictPort: true,
    open: true,
  },
});
