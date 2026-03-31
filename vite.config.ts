import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import type { ServerResponse } from "http";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [
      "1553-119-30-118-190.ngrok-free.app",
      ".ngrok-free.app",
    ],
    hmr: {
      overlay: false,
    },
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        configure(proxy) {
          proxy.on("error", (_err, _req, res) => {
            const r = res as ServerResponse;
            if (!r || r.headersSent) return;
            r.writeHead(502, { "Content-Type": "application/json" });
            r.end(
              JSON.stringify({
                error:
                  "Chat API is not running. In this project start the backend on port 3001: open a second terminal and run npm run server, or use npm run dev:all (Vite + API together).",
              })
            );
          });
        },
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
