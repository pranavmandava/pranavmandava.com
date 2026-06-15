import matter from "gray-matter"
import rehypeStringify from "rehype-stringify"
import { remark } from "remark"
import remarkGfm from "remark-gfm"
import remarkRehype from "remark-rehype"
import type { Quest, QuestMeta } from "./quests"

const questModules = import.meta.glob("/src/content/quests/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>

function formatDate(value: unknown): string | undefined {
  if (value == null) return undefined
  if (value instanceof Date) return value.toISOString().split("T")[0]
  return String(value)
}

function questMetaFromMatter(slug: string, data: Record<string, unknown>): QuestMeta {
  return {
    slug,
    title: String(data.title ?? ""),
    description: String(data.description ?? ""),
    created: formatDate(data.created) ?? "",
    lastModified: formatDate(data.lastModified),
    image: data.image ? String(data.image) : undefined,
    status: (data.status as QuestMeta["status"]) ?? undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
  }
}

function parseQuest(filePath: string, content: string): QuestMeta {
  const slug = filePath.split("/").pop()!.replace(/\.md$/, "")
  const { data } = matter(content)
  return questMetaFromMatter(slug, data as Record<string, unknown>)
}

export function getAllQuests(): QuestMeta[] {
  return Object.entries(questModules)
    .map(([path, content]) => parseQuest(path, content))
    .sort((a, b) => (a.created > b.created ? -1 : 1))
}

export async function getQuest(slug: string): Promise<Quest | null> {
  const entry = Object.entries(questModules).find(([path]) =>
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
    ...questMetaFromMatter(slug, data as Record<string, unknown>),
    content: processedContent.toString(),
  }
}

export function getAllQuestSlugs(): string[] {
  return Object.keys(questModules).map((path) =>
    path.split("/").pop()!.replace(/\.md$/, "")
  )
}
