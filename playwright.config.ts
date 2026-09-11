import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir: './e2e', workers: 1, timeout: 60000, retries: 0, use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure' }, reporter: [['list'], ['html', {open:'never'}]] });
