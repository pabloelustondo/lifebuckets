import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import tailwind from '@tailwindcss/vite';
export default defineConfig({ plugins: [tailwind(), reactRouter()], server: {proxy: {'/api/chatkit': {target: 'http://127.0.0.1:8001', changeOrigin: false}}} });
