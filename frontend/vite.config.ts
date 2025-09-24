import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path-browserify";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "../../shared"),
    },
  },
  server: {
    allowedHosts: [
      "dashboard-data-vizualizer-fe.onrender.com", // ✅ your frontend domain
    ],
    host: "0.0.0.0", // ✅ recommended if deploying dev server
    port: +(process?.env?.PORT || 5173),
  },
});
