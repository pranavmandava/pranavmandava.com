import { Link } from "@tanstack/react-router"
import type { QuestMeta } from "@/lib/quests"

const statusLabel: Record<NonNullable<QuestMeta["status"]>, string> = {
  "in-progress": "in progress",
  done: "done",
  abandoned: "abandoned",
}

const statusClass: Record<NonNullable<QuestMeta["status"]>, string> = {
  "in-progress": "text-amber-600 dark:text-amber-400",
  done: "text-green-600 dark:text-green-400",
  abandoned: "text-muted-foreground",
}

type QuestListProps = {
  quests: QuestMeta[]
}

export function QuestList({ quests }: QuestListProps) {
  if (quests.length === 0) {
    return <p className="text-sm text-muted-foreground">No side quests yet.</p>
  }

  return (
    <ul className="space-y-8">
      {quests.map((quest) => (
        <li key={quest.slug}>
          <Link
            to="/quests/$slug"
            params={{ slug: quest.slug }}
            className="group block"
          >
            {quest.image && (
              <img
                src={quest.image}
                alt={quest.title}
                className="mb-3 h-40 w-full rounded-md object-cover"
              />
            )}
            <h3 className="text-primary group-hover:text-foreground group-hover:underline">
              {quest.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground leading-snug">
              {quest.description}
            </p>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span>{quest.created}</span>
              {quest.status && (
                <>
                  <span>·</span>
                  <span className={statusClass[quest.status]}>
                    {statusLabel[quest.status]}
                  </span>
                </>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
