import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import tailwind from '@tailwindcss/vite';
export default defineConfig({ plugins: [tailwind(), reactRouter()] });
