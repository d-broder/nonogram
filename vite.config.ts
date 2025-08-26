import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],

          // Feature chunks
          firebase: ["firebase/app", "firebase/firestore"],
          game: [
            "./src/features/game/hooks/useGameState.ts",
            "./src/features/game/components/GameBoard/GameBoard.tsx",
          ],

          // UI chunks
          ui: [
            "./src/features/ui/index.ts",
            "./src/shared/components/index.ts",
          ],
        },
      },
    },
    // Adjust chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
});
