import { defineConfig } from "astro/config";

// Static-first config. No adapter. No SSR. No runtime server. Cloudflare Pages Free-friendly.
// Deployment target: publish the `dist/` directory as a plain static site.
export default defineConfig({
  site: "https://nosilverbullet.dev",
  output: "static",
  trailingSlash: "never",
  build: {
    format: "directory",
    assets: "_assets",
  },
  compressHTML: true,
  vite: {
    resolve: {
      alias: {
        "@": new URL("./src", import.meta.url).pathname,
        "@content": new URL("./content", import.meta.url).pathname,
      },
    },
  },
});
