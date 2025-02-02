import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  define: {
    'process.env': {}, // To avoid issues with process usage
  },
  plugins: [react()],
  envDir: '../', // Ensure this matches the location of your environment variables file
  base: "./",
  server: {
    allowedHosts: ["buzz-rim-nice-dc.trycloudflare.com","cj05.github.io/PLANIFY_DEBUG/"],
    proxy: {
      '/socket': {
        target: 'wss://discord.com/api/', // Proxy Discord WebSocket API requests
        ws: true, // Ensure WebSocket is properly proxied
      },
    },
    hmr: {
      clientPort: 5173, // Adjust this if your frontend is on a different port
    },
  },
});
