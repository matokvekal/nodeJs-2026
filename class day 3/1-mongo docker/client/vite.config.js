import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    // proxy /students and /employees requests to the Express server
    proxy: {
      "/students": "http://localhost:5000",
      "/employees": "http://localhost:5000",
      "/uploads": "http://localhost:5000",
    },
  },
});
