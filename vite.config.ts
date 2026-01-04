import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Otimizações para produção
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log em produção
      },
    },
    rollupOptions: {
      output: {
        // Code splitting para melhor performance
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          supabase: ["@supabase/supabase-js", "@supabase/auth-helpers-react"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-popover"],
          charts: ["recharts"],
          query: ["@tanstack/react-query"],
          pdf: ["jspdf", "jspdf-autotable", "html2canvas"],
        },
      },
    },
    chunkSizeWarningLimit: 600, // Aumentado de 500kb padrão
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "production"),
  },
}));
