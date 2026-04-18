import { defineConfig } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  build: {
    // Build pc-model.ts as a self-contained ES module so Three.js
    // is bundled locally from npm — no CDN dependency.
    lib: {
      entry: resolve(__dirname, 'src/pc-model.ts'),
      formats: ['es'],
      fileName: () => 'pc-model',
    },
    outDir: 'assets',
    // Don't wipe the rest of the assets folder on build.
    emptyOutDir: false,
    // Minify for production.
    minify: true,
  },
})
