export interface QuestMeta {
  slug: string
  title: string
  description: string
  created: string
  lastModified?: string
  image?: string
  status?: "in-progress" | "done" | "abandoned"
  tags: string[]
}

export interface Quest extends QuestMeta {
  content: string
}
