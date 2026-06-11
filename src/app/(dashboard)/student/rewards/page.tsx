"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Gift, Coins, Percent, Tag, Zap, ExternalLink, Clock, CheckCircle2, X } from "lucide-react"

interface RewardItem {
  id: string
  title: string
  description: string | null
  pointsCost: number
  type: "COUPON" | "DISCOUNT" | "PROMO"
  value: string
  isActive: boolean
  stock: number | null
  sponsor: { name: string; logoUrl: string | null; websiteUrl: string | null } | null
}

interface RedemptionItem {
  id: string
  pointsSpent: number
  code: string | null
  status: string
  redeemedAt: string
  reward: { title: string; type: string; value: string; pointsCost: number }
}

const typeConfig: Record<string, { icon: typeof Gift; label: string }> = {
  COUPON: { icon: Tag, label: "Coupon" },
  DISCOUNT: { icon: Percent, label: "Discount" },
  PROMO: { icon: Gift, label: "Promo" },
}

export default function StudentRewardsPage() {
  const { data: session } = useSession()
  const [rewards, setRewards] = useState<RewardItem[]>([])
  const [userPoints, setUserPoints] = useState(0)
  const [redemptions, setRedemptions] = useState<RedemptionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [redeeming, setRedeeming] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    Promise.all([
      fetch("/api/rewards").then((r) => r.json()),
      fetch("/api/rewards/my").then((r) => r.json()),
    ]).then(([rewardsData, historyData]) => {
      setRewards(rewardsData.rewards)
      setUserPoints(rewardsData.userPoints)
      setRedemptions(historyData.redemptions)
    }).finally(() => setLoading(false))
  }, [])

  const handleRedeem = async (rewardId: string) => {
    setRedeeming(rewardId)
    setError("")
    try {
      const res = await fetch(`/api/rewards/${rewardId}/redeem`, { method: "POST" })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error)
        return
      }
      setShowSuccess(data.code)
      setUserPoints((p) => p - data.pointsSpent)
      setRedemptions((prev) => [data, ...prev])
      setRewards((prev) =>
        prev.map((r) =>
          r.id === rewardId
            ? { ...r, stock: r.stock !== null ? r.stock - 1 : null }
            : r
        )
      )
    } catch {
      setError("Failed to redeem reward")
    } finally {
      setRedeeming(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rewards</h1>
          <p className="text-sm text-muted-foreground">Redeem your points for exclusive rewards</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full border px-4 py-1.5">
            <Zap className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-bold tabular-nums">{userPoints.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">points</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowHistory(!showHistory)}>
            <Clock className="h-4 w-4 mr-1.5" />
            {showHistory ? "Browse Rewards" : "My History"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {showSuccess && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/30">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Reward Redeemed!</h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                Your redemption code is:
              </p>
              <div className="mt-2 inline-block rounded-md bg-emerald-100 px-4 py-2 font-mono text-lg font-bold tracking-wider text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
                {showSuccess}
              </div>
              <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-2">
                Copy this code and use it at checkout. It has also been saved to your history.
              </p>
            </div>
            <button onClick={() => setShowSuccess(null)} className="text-emerald-500 hover:text-emerald-700">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {showHistory ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Redemption History ({redemptions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {redemptions.map((r) => (
                <div key={r.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{r.reward.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.reward.type} &middot; {r.pointsSpent.toLocaleString()} points &middot;{" "}
                      {new Date(r.redeemedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    {r.code && (
                      <span className="font-mono text-xs font-bold tracking-wider text-primary">
                        {r.code}
                      </span>
                    )}
                    <Badge variant={r.status === "approved" ? "default" : "secondary"} className="ml-2 text-[10px]">
                      {r.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {redemptions.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No redemptions yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {rewards.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Gift className="h-12 w-12 text-muted-foreground/30" />
                <h3 className="mt-3 text-lg font-semibold">No rewards available</h3>
                <p className="text-sm text-muted-foreground">Check back later for new rewards</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rewards.map((reward) => {
                const tc = typeConfig[reward.type] || typeConfig.COUPON
                const Icon = tc.icon
                const canAfford = userPoints >= reward.pointsCost
                const outOfStock = reward.stock !== null && reward.stock <= 0

                return (
                  <Card key={reward.id} className={`flex flex-col transition-all hover:shadow-md ${!canAfford || outOfStock ? "opacity-60" : ""}`}>
                    <CardContent className="p-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <Badge variant="secondary" className="text-[10px]">
                          {tc.label}
                        </Badge>
                      </div>

                      <h3 className="font-semibold">{reward.title}</h3>
                      {reward.description && (
                        <p className="text-xs text-muted-foreground mt-1 flex-1">{reward.description}</p>
                      )}

                      {reward.sponsor && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Sponsored by {reward.sponsor.name}
                        </p>
                      )}

                      <div className="mt-4 flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-1">
                          <Coins className="h-4 w-4 text-amber-500" />
                          <span className="text-sm font-bold">{reward.pointsCost.toLocaleString()}</span>
                        </div>
                        {outOfStock ? (
                          <Badge variant="secondary">Out of stock</Badge>
                        ) : (
                          <Button
                            size="sm"
                            disabled={!canAfford || redeeming === reward.id}
                            onClick={() => handleRedeem(reward.id)}
                          >
                            {redeeming === reward.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              "Redeem"
                            )}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
