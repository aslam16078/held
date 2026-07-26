import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        aiSolutions: resolve(__dirname, 'ai-solutions.html'),
        machineLearning: resolve(__dirname, 'machine-learning.html'),
        automation: resolve(__dirname, 'automation.html'),
        webApps: resolve(__dirname, 'web-apps.html'),
        futureTech: resolve(__dirname, 'future-tech.html'),
        customIntegrations: resolve(__dirname, 'custom-integrations.html'),
      },
    },
  },
});
