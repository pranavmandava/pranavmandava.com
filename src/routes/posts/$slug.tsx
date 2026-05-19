import type { Post } from "@/lib/posts"
import { createFileRoute, Link } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { TagBadge } from "@/components/TagBadge"
import { tagLabel } from "@/lib/tags"

const fetchPost = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const { getPost } = await import("@/lib/posts.server")
    const post = await getPost(data.slug)
    if (!post) throw new Error("Post not found")
    return post
  })

export const Route = createFileRoute("/posts/$slug")({
  loader: ({ params }) => fetchPost({ data: { slug: params.slug } }),
  head: ({ loaderData }) => {
    const post = loaderData as Post
    const siteUrl = process.env.SITE_URL || "https://pranavmandava.com"
    const postUrl = `${siteUrl}/posts/${post.slug}`
    const publishedDate = new Date(post.created).toISOString()
    const modifiedDate = post.lastModified
      ? new Date(post.lastModified).toISOString()
      : publishedDate
    const keywords = post.tags.map(tagLabel).join(", ")

    return {
      meta: [
        { title: `${post.title} | Pranav Mandava` },
        { name: "description", content: post.description },
        { name: "author", content: post.authors.join(", ") },
        { name: "keywords", content: keywords },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: postUrl },
        { property: "article:published_time", content: publishedDate },
        { property: "article:modified_time", content: modifiedDate },
        { property: "article:author", content: post.authors.join(", ") },
        { property: "article:tag", content: keywords },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: post.description },
      ],
      links: [{ rel: "canonical", href: postUrl }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            author: {
              "@type": "Person",
              name: post.authors.join(", "),
            },
            datePublished: publishedDate,
            dateModified: modifiedDate,
            url: postUrl,
            keywords,
          }),
        },
      ],
    }
  },
  component: PostPage,
})

function PostPage() {
  const post = Route.useLoaderData() as Post

  return (
    <article>
      <Link
        to="/"
        className="mb-6 inline-block text-xs text-muted-foreground hover:text-primary hover:underline"
      >
        ← Back to posts
      </Link>

      <header className="mb-8">
        <h1 className="mb-2 text-xl font-bold text-foreground">{post.title}</h1>
        <p className="mb-2 text-sm text-muted-foreground">{post.description}</p>
        <p className="text-xs text-muted-foreground/80">
          {post.created}
          {post.lastModified && ` · Updated ${post.lastModified}`}
          {" · "}
          {post.authors.join(", ")}
        </p>
        {post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.map((slug) => (
              <TagBadge key={slug} slug={slug} relTag />
            ))}
          </div>
        )}
      </header>

      <div
        className="prose-blog"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  )
}
