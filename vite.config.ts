import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Fast Refresh is enabled by default in Vite
      // Enable Babel optimizations for production builds
      babel: {
        plugins: [
          [
            "babel-plugin-transform-remove-console",
            { exclude: ["error", "warn"] },
          ],
        ],
      },
    }),
  ],
  optimizeDeps: {
    exclude: ["lucide-react"],
    // Include dependencies that should be pre-bundled
    include: ["react", "react-dom", "framer-motion"],
    // Enable dependency optimization caching
    force: false,
  },
  build: {
    minify: "esbuild", // Use esbuild for faster builds
    target: "es2015", // Target modern browsers for smaller code
    chunkSizeWarningLimit: 1000, // Increase warning limit for chunks
    cssCodeSplit: true, // Split CSS for better caching
    reportCompressedSize: false, // Skip reporting compressed sizes for faster builds
    sourcemap: false, // Disable source maps in production for smaller files
    assetsInlineLimit: 4096, // Inline small assets to avoid extra requests
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "framer-motion": ["framer-motion"],
          lucide: ["lucide-react"],
        },
        // Optimize code splitting
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash].[ext]",
      },
    },
  },
  server: {
    allowedHosts: [
      "0xdaddy.ogserver.eu.org",
      "0xarchit.ogserver.eu.org",
      "0xarc.ogserver.eu.org",
    ],
  },
  mode: "production",
});
