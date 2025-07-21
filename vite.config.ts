import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@context": "/src/context",
      "@hooks": "/src/hooks",
      "@layout": "/src/components/layout",
      "@pages": "/src/pages",
      "@ui": "/src/components/ui",
    },
  },
});
