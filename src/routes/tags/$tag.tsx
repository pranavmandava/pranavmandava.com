import { createFileRoute, Link, notFound } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { PostList } from "@/components/PostList"
import { tagLabel } from "@/lib/tags"
import type { PostMeta } from "@/lib/posts"
import type { TagRecord } from "@/generated/tag-store"

const getTagPage = createServerFn({ method: "GET" })
  .inputValidator((data: { tag: string }) => data)
  .handler(async ({ data }) => {
    const { getTagBySlug, getPostsByTagSlug } = await import("@/lib/posts.server")
    const record = getTagBySlug(data.tag)
    if (!record) return null
    const posts = getPostsByTagSlug(data.tag)
    return { tag: record as TagRecord, posts }
  })

export const Route = createFileRoute("/tags/$tag")({
  loader: ({ params }) => getTagPage({ data: { tag: params.tag } }),
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Tag not found" }] }
    const { tag } = loaderData
    const label = tagLabel(tag.slug)
    return {
      meta: [
        { title: `${label} | Tags | Pranav Mandava` },
        {
          name: "description",
          content: `${tag.count} post${tag.count === 1 ? "" : "s"} tagged “${label}”.`,
        },
      ],
      links: [{ rel: "canonical", href: `/tags/${tag.slug}` }],
    }
  },
  component: TagArchivePage,
})

function TagArchivePage() {
  const data = Route.useLoaderData()

  if (!data) {
    throw notFound()
  }

  const { tag, posts } = data as { tag: TagRecord; posts: PostMeta[] }
  const label = tagLabel(tag.slug)

  return (
    <div>
      <div className="mb-8">
        <Link
          to="/tags"
          className="text-xs text-muted-foreground hover:text-primary hover:underline"
        >
          ← All tags
        </Link>
        <h1 className="mt-4 text-lg font-semibold text-foreground">{label}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {tag.count} post{tag.count === 1 ? "" : "s"}
        </p>
      </div>
      <PostList posts={posts} />
    </div>
  )
}
