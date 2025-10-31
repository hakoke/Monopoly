import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), basicSsl()],
    build: {
        outDir: "docs"
    },
    server: {
        https: true,
    },
    // Use /Monopoly/ for GitHub Pages, / for Railway/Root deployments
    // Set VITE_BASE_PATH="/Monopoly/" environment variable for GitHub Pages
    // Railway should use "/" so don't set VITE_BASE_PATH for Railway
    base: process.env.VITE_BASE_PATH || "/",
});
