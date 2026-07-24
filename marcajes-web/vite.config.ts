import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),],
  base: "/marcajes/",
  server: {
    host: true,
    hmr: false,
    allowedHosts: [
      "login.solutions.local",
      "marcajes-web"
    ]
  }
})
