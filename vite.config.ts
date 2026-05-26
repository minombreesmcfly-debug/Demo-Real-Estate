import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, loadEnv} from 'vite';

// Auto-create dummy config if missing (e.g. cloned from GitHub without config) to prevent build failures
const configPath = path.resolve(__dirname, './firebase-applet-config.json');
if (!fs.existsSync(configPath)) {
  fs.writeFileSync(configPath, JSON.stringify({
    projectId: "demo-real-estate",
    appId: "1:12345678:web:abcdefgh",
    apiKey: "AIzaSy_GITHUB_ALERT_RESOLVED_MOCK_KEY_DEMO",
    authDomain: "demo-real-estate.firebaseapp.com",
    firestoreDatabaseId: "default",
    storageBucket: "demo-real-estate.appspot.com",
    messagingSenderId: "12345678"
  }, null, 2));
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
