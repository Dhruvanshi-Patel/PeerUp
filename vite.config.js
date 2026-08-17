import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
    // No proxy needed — on Vercel, /api/* is handled by serverless functions natively.
    // For local dev, run `vercel dev` which handles both frontend and API functions together.
  }
});
