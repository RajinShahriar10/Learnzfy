import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { StreakWidget } from "@/components/streak/streak-widget"

export default async function StudentStreakPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/signin")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Your Streak</h1>
        <p className="text-muted-foreground mt-1">
          Track your daily learning consistency and earn milestone rewards
        </p>
      </div>
      <StreakWidget />
    </div>
  )
}
