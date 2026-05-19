import { createFileRoute, Link } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { PostList } from "@/components/PostList"
import type { PostMeta } from "@/lib/posts"

const getPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { getAllPosts } = await import("@/lib/posts.server")
  return getAllPosts()
})

export const Route = createFileRoute("/")({
  loader: () => getPosts(),
  head: () => ({
    meta: [
      { title: "Pranav Mandava - Posts" },
      {
        name: "description",
        content:
          "Personal website and blog of Pranav Mandava - M.S Computer Science at ASU. Essays, thoughts, and writings on technology, computer science, and more.",
      },
      { property: "og:title", content: "Pranav Mandava - Posts" },
      {
        property: "og:description",
        content:
          "Personal website and blog of Pranav Mandava - M.S Computer Science at ASU",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:url",
        content: process.env.SITE_URL || "https://pranavmandava.com",
      },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Pranav Mandava - Posts" },
      {
        name: "twitter:description",
        content:
          "Personal website and blog of Pranav Mandava - M.S Computer Science at ASU",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
})

function HomePage() {
  const posts = Route.useLoaderData()

  return (
    <div>
      <div className="mb-8 flex items-baseline justify-between gap-4">
        <h2 className="text-lg font-semibold text-foreground">Posts</h2>
        <Link
          to="/tags"
          className="text-xs text-muted-foreground hover:text-primary hover:underline"
        >
          Browse tags →
        </Link>
      </div>
      <PostList posts={posts as PostMeta[]} />
    </div>
  )
}
