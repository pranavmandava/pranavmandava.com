export interface PostMeta {
  slug: string
  title: string
  description: string
  created: string
  lastModified?: string
  authors: string[]
  tags: string[]
  status?: "in-progress" | "done" | "abandoned"
}

export interface Post extends PostMeta {
  content: string
}
