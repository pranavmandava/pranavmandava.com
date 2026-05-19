import { Link } from "@tanstack/react-router"
import type { PostMeta } from "@/lib/posts"
import { TagBadge } from "@/components/TagBadge"

type PostListProps = {
  posts: PostMeta[]
}

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return <p className="text-sm text-muted-foreground">No posts found.</p>
  }

  return (
    <ul className="space-y-6">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            to="/posts/$slug"
            params={{ slug: post.slug }}
            className="group block"
          >
            <h3 className="text-primary group-hover:text-foreground group-hover:underline">
              {post.title}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">{post.created}</p>
          </Link>
          {post.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {post.tags.map((slug) => (
                <TagBadge key={slug} slug={slug} relTag />
              ))}
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
