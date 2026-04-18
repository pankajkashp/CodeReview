import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
 HEAD
    proxy: {
      "/review": {
        target: "http://localhost:3001",
        changeOrigin: true
      }
    }
 3db12486b5fc272057871d41b9ba08d2db6728ec
  },
  preview: {
    host: "0.0.0.0",
    port: 5173,
 HEAD
    proxy: {
      "/review": {
        target: "http://localhost:3001",
        changeOrigin: true
      }
    }
3db12486b5fc272057871d41b9ba08d2db6728ec
  }
});

