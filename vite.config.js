import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@codemirror/lang-")) {
              return "vendor-codemirror-langs";
            }
            if (id.includes("@codemirror") || id.includes("@uiw")) {
              return "vendor-codemirror-core";
            }
            if (id.includes("gsap")) {
              return "vendor-gsap";
            }
            if (id.includes("@supabase")) {
              return "vendor-supabase";
            }
            if (id.includes("react-router")) {
              return "vendor-router";
            }
            if (id.includes("react") || id.includes("scheduler")) {
              return "vendor-react";
            }
          }
        }
      }
    }
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true
      }
    }
  },
  preview: {
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true
      }
    }
  }
});
