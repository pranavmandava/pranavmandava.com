import { execSync } from "node:child_process"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import type { Plugin } from "vite"

const POSTS_GLOB = /src\/content\/posts\/.+\.md$/
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")

function generateTagStore(): void {
  execSync("bun scripts/build-tag-store.ts", {
    cwd: ROOT,
    stdio: "inherit",
  })
}

export function tagStorePlugin(): Plugin {
  let built = false

  const run = () => {
    generateTagStore()
    built = true
  }

  return {
    name: "tag-store",
    buildStart() {
      run()
    },
    configureServer(server) {
      if (!built) run()
      const onPostsChange = (file: string) => {
        if (POSTS_GLOB.test(file.replace(/\\/g, "/"))) run()
      }
      server.watcher.on("change", onPostsChange)
      server.watcher.on("add", onPostsChange)
      server.watcher.on("unlink", onPostsChange)
    },
  }
}
