import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commonjs from '@rollup/plugin-commonjs';

export default defineConfig({
  plugins: [react(), commonjs()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true,
  },
})