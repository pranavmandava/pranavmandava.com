import type { TagRecord } from "@/generated/tag-store"
import { TagBadge } from "@/components/TagBadge"

type TagListProps = {
  tags: TagRecord[]
  showCount?: boolean
}

export function TagList({ tags, showCount = true }: TagListProps) {
  if (tags.length === 0) {
    return <p className="text-sm text-muted-foreground">No tags yet.</p>
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li key={tag.slug}>
          <TagBadge
            slug={tag.slug}
            count={showCount ? tag.count : undefined}
          />
        </li>
      ))}
    </ul>
  )
}
