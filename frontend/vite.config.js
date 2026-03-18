import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";   // 👈 import react plugin
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),       // 👈 enable React
    tailwindcss(), // 👈 enable Tailwind
  ],
});
