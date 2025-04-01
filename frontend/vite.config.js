import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Allows access from network devices
    // port: 5173, // (Optional) Change if needed
    // strictPort: true, // Ensures the port doesn’t change if 5173 is busy
  },
})
