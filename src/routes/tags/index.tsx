import { createFileRoute, Link } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { TagList } from "@/components/TagList"
import type { TagRecord } from "@/generated/tag-store"

const getTags = createServerFn({ method: "GET" }).handler(async () => {
  const { tagStore } = await import("@/lib/posts.server")
  return tagStore as TagRecord[]
})

export const Route = createFileRoute("/tags/")({
  loader: () => getTags(),
  head: () => ({
    meta: [
      { title: "Tags | Pranav Mandava" },
      {
        name: "description",
        content: "Browse posts by topic on Pranav Mandava's blog.",
      },
    ],
    links: [{ rel: "canonical", href: "/tags" }],
  }),
  component: TagsIndexPage,
})

function TagsIndexPage() {
  const tags = Route.useLoaderData()

  return (
    <div>
      <div className="mb-8 flex items-baseline justify-between gap-4">
        <h1 className="text-lg font-semibold text-foreground">Tags</h1>
        <Link
          to="/"
          className="text-xs text-muted-foreground hover:text-primary hover:underline"
        >
          ← All posts
        </Link>
      </div>
      <TagList tags={tags} />
    </div>
  )
}
