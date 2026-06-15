import matter from "gray-matter"
import rehypeStringify from "rehype-stringify"
import { remark } from "remark"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import { getTagBySlug, tags as tagStore } from "@/generated/tag-store"
import { normalizeTags } from "./tags"
import type { Post, PostMeta } from "./posts"

const postModules = import.meta.glob("/src/content/posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>

function formatDate(value: unknown): string | undefined {
  if (value == null) return undefined
  if (value instanceof Date) return value.toISOString().split("T")[0]
  return String(value)
}

function postMetaFromMatter(slug: string, data: Record<string, unknown>): PostMeta {
  return {
    slug,
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    created: formatDate(data.created) ?? "",
    lastModified: formatDate(data.lastModified),
    authors: Array.isArray(data.authors) ? data.authors.map(String) : [],
    tags: normalizeTags(data.tags),
    status: (data.status as PostMeta["status"]) ?? undefined,
  }
}

function parsePost(filePath: string, content: string): PostMeta {
  const slug = filePath.split("/").pop()!.replace(/\.md$/, "")
  const { data } = matter(content)
  return postMetaFromMatter(slug, data as Record<string, unknown>)
}

export function getAllPosts(): PostMeta[] {
  return Object.entries(postModules)
    .map(([path, content]) => parsePost(path, content))
    .sort((a, b) => (a.created > b.created ? -1 : 1))
}

export async function getPost(slug: string): Promise<Post | null> {
  const entry = Object.entries(postModules).find(([path]) =>
    path.endsWith(`/${slug}.md`)
  )

  if (!entry) return null

  const [, rawContent] = entry
  const { data, content: markdownContent } = matter(rawContent)

  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdownContent)

  return {
    ...postMetaFromMatter(slug, data as Record<string, unknown>),
    content: processedContent.toString(),
  }
}

export function getAllPostSlugs(): string[] {
  return Object.keys(postModules).map((path) =>
    path.split("/").pop()!.replace(/\.md$/, "")
  )
}

export function getPostsByTagSlug(tagSlug: string): PostMeta[] {
  const record = getTagBySlug(tagSlug)
  if (!record) return []

  const slugSet = new Set(record.postSlugs)
  return getAllPosts().filter((post) => slugSet.has(post.slug))
}

export { tagStore, getTagBySlug }
