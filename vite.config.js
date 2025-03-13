import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { qrcode } from 'vite-plugin-qrcode'; // Correct import

export default defineConfig({
    plugins: [react(), qrcode()],
    server: {
        host: true,  // Enables access from mobile devices
        port: 5173,  // Default Vite port
    },
});
