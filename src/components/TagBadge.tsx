import { Link } from "@tanstack/react-router"
import { Badge } from "@/components/ui/badge"
import { tagLabel } from "@/lib/tags"
import { cn } from "@/lib/utils"

type TagBadgeProps = {
  slug: string
  count?: number
  className?: string
  relTag?: boolean
}

export function TagBadge({ slug, count, className, relTag }: TagBadgeProps) {
  const label = tagLabel(slug)
  const text = count != null ? `${label} (${count})` : label

  return (
    <Badge
      variant="secondary"
      className={cn("font-normal", className)}
      render={
        <Link
          to="/tags/$tag"
          params={{ tag: slug }}
          {...(relTag ? { rel: "tag" } : {})}
        />
      }
    >
      {text}
    </Badge>
  )
}
