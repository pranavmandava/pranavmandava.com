import { createFileRoute } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { QuestList } from "@/components/QuestList"
import type { QuestMeta } from "@/lib/quests"

const getQuests = createServerFn({ method: "GET" }).handler(async () => {
  const { getAllQuests } = await import("@/lib/quests.server")
  return getAllQuests()
})

export const Route = createFileRoute("/quests/")({
  loader: () => getQuests(),
  head: () => ({
    meta: [
      { title: "Side Quests | Pranav Mandava" },
      {
        name: "description",
        content: "Tiny things I've been working on and learning — a log of side projects, experiments, and explorations.",
      },
    ],
  }),
  component: QuestsPage,
})

function QuestsPage() {
  const quests = Route.useLoaderData()

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-foreground">Side Quests</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tiny things I've been working on and learning.
        </p>
      </div>
      <QuestList quests={quests as QuestMeta[]} />
    </div>
  )
}
