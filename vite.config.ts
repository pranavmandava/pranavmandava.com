import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import { tagStorePlugin } from "./vite-plugins/tag-store";

const config = defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    tsconfigPaths: true,
  },
  plugins: [
    tagStorePlugin(),
    tailwindcss(),
    devtools(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),

    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
      },
      sitemap: {
        enabled: true,
        host: process.env.SITE_URL || "https://pranavmandava.com",
      },
    }),
    viteReact(),
  ],
});

export default config;
