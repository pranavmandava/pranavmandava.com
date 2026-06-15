import type { Quest } from "@/lib/quests"
import { createFileRoute, Link } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"

const fetchQuest = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    const { getQuest } = await import("@/lib/quests.server")
    const quest = await getQuest(data.slug)
    if (!quest) throw new Error("Quest not found")
    return quest
  })

export const Route = createFileRoute("/quests/$slug")({
  loader: ({ params }) => fetchQuest({ data: { slug: params.slug } }),
  head: ({ loaderData }) => {
    const quest = loaderData as Quest
    return {
      meta: [
        { title: `${quest.title} | Pranav Mandava` },
        { name: "description", content: quest.description },
      ],
    }
  },
  component: QuestPage,
})

const statusLabel: Record<NonNullable<Quest["status"]>, string> = {
  "in-progress": "in progress",
  done: "done",
  abandoned: "abandoned",
}

const statusClass: Record<NonNullable<Quest["status"]>, string> = {
  "in-progress": "text-amber-600 dark:text-amber-400",
  done: "text-green-600 dark:text-green-400",
  abandoned: "text-muted-foreground",
}

function QuestPage() {
  const quest = Route.useLoaderData() as Quest

  return (
    <article>
      <Link
        to="/quests"
        className="mb-6 inline-block text-xs text-muted-foreground hover:text-primary hover:underline"
      >
        ← Back to side quests
      </Link>

      {quest.image && (
        <img
          src={quest.image}
          alt={quest.title}
          className="mb-6 h-56 w-full rounded-lg object-cover"
        />
      )}

      <header className="mb-8">
        <h1 className="mb-2 text-xl font-bold text-foreground">{quest.title}</h1>
        <p className="mb-2 text-sm text-muted-foreground">{quest.description}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
          <span>{quest.created}</span>
          {quest.lastModified && <span>· Updated {quest.lastModified}</span>}
          {quest.status && (
            <>
              <span>·</span>
              <span className={statusClass[quest.status]}>
                {statusLabel[quest.status]}
              </span>
            </>
          )}
        </div>
      </header>

      <div
        className="prose-blog"
        dangerouslySetInnerHTML={{ __html: quest.content }}
      />
    </article>
  )
}
