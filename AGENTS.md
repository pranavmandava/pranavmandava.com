# AGENTS.md

## Commands
- `bun dev` - Start dev server on port 3000
- `bun build` - Production build with static prerendering
- `bun test` - Run all tests (vitest)
- `bun test <file>` - Run a single test file
- `bunx tsc --noEmit` - Typecheck

## Architecture
- **Framework**: TanStack Start (React 19 + TanStack Router + Nitro SSR)
- **Styling**: Tailwind v4 + shadcn/ui (Base UI). Amber theme via CSS variables in `src/styles.css` (`bg-background`, `text-primary`, etc.)
- **Content**: Markdown posts in `src/content/posts/` with slugified `tags: ["essay"]` in frontmatter
- **Tag index**: Build-time SQLite (`bun:sqlite` in `scripts/build-tag-store.ts`) → `src/generated/tag-store.ts` (regenerated on `bun run build:tags` and via Vite `tagStorePlugin`)
- **src/routes/**: `/`, `/posts/$slug`, `/tags`, `/tags/$tag`
- **src/lib/posts.server.ts**: Post loading + tag queries (imports generated store)
- **Static prerendering**: Enabled in vite.config.ts with crawlLinks (discovers tag pages via links)

## Code Style
- TypeScript strict mode enabled
- Use `@/*` path alias for imports from src/
- React components: PascalCase files, named function exports
- No unused locals/parameters (enforced by tsconfig)
- ESM modules only (`"type": "module"`)
