/** Lowercase URL-safe tag slug (Simon Willison-style: `[a-z0-9]+`). */
export function slugifyTag(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/** Human-readable label from a slug. */
export function tagLabel(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

/** Normalize frontmatter tags to slugs. */
export function normalizeTags(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  const seen = new Set<string>()
  const out: string[] = []
  for (const item of raw) {
    const slug = slugifyTag(String(item))
    if (!slug || seen.has(slug)) continue
    seen.add(slug)
    out.push(slug)
  }
  return out
}
