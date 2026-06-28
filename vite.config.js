import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default {
  server: {
    host: '0.0.0.0', // Make it listen on all interfaces
    port: 3000,       // Or any other port you're using
    proxy: null, // Disable proxy temporarily to test
  },
};
