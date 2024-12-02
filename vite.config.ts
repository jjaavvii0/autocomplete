import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@features": path.resolve(__dirname, "./src/features"),
            "@shared": path.resolve(__dirname, "./src/shared"),
        },
    },
});
