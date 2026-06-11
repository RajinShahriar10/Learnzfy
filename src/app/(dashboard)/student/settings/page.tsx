"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Bell, Globe, Shield, User, Copy, Check } from "lucide-react"

type Visibility = "public" | "private" | "friends_only"

export default function SettingsPage() {
  const [privacy, setPrivacy] = useState<{
    profileVisibility: Visibility
    showOnLeaderboard: boolean
    shareLearningActivity: boolean
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch("/api/student/privacy")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setPrivacy(res.data)
      })
      .finally(() => setLoading(false))
  }, [])

  const profileUrl = privacy ? `${window.location.origin}/profile/${privacy.profileVisibility === "private" ? "" : "..."}` : ""

  async function handleSave() {
    if (!privacy) return
    setSaved(false)
    const res = await fetch("/api/student/privacy", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(privacy),
    })
    const data = await res.json()
    if (data.success) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  function copyProfileUrl() {
    if (privacy?.profileVisibility === "private") return
    navigator.clipboard.writeText(`${window.location.origin}/profile/${privacy?.profileVisibility === "public" ? "..." : ""}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </CardTitle>
          <CardDescription>
            Choose what notifications you receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Course updates", desc: "When courses you're enrolled in are updated" },
            { label: "Achievement alerts", desc: "When you unlock a new achievement or badge" },
            { label: "Weekly progress report", desc: "Get a summary of your learning each week" },
            { label: "Marketing emails", desc: "Receive updates about new courses and features" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </div>
              <label className="relative inline-flex h-5 w-9 cursor-pointer items-center">
                <input type="checkbox" defaultChecked className="peer sr-only" />
                <span className="absolute inset-0 rounded-full bg-muted-foreground/30 transition peer-checked:bg-primary" />
                <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-4" />
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Preferences
          </CardTitle>
          <CardDescription>
            Customize your learning experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Language</div>
              <div className="text-xs text-muted-foreground">
                Preferred language for the platform
              </div>
            </div>
            <select className="rounded-md border border-input bg-background px-3 py-1.5 text-sm">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Time Zone</div>
              <div className="text-xs text-muted-foreground">
                Display times in your local time zone
              </div>
            </div>
            <select className="rounded-md border border-input bg-background px-3 py-1.5 text-sm">
              <option>UTC (UTC+0)</option>
              <option>EST (UTC-5)</option>
              <option>PST (UTC-8)</option>
              <option>GMT (UTC+0)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Privacy
          </CardTitle>
          <CardDescription>
            Control who can see your learning profile
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading privacy settings...</p>
          ) : privacy ? (
            <>
              {/* Profile Visibility */}
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium">Profile Visibility</div>
                  <div className="text-xs text-muted-foreground">
                    Who can view your achievement profile
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "public" as const, label: "Public", desc: "Anyone can view your profile" },
                    { value: "private" as const, label: "Private", desc: "Only you can view your profile" },
                    { value: "friends_only" as const, label: "Friends Only", desc: "Coming soon" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setPrivacy({ ...privacy, profileVisibility: opt.value })}
                      className={`flex-1 rounded-lg border p-3 text-left transition ${
                        privacy.profileVisibility === opt.value
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "hover:border-muted-foreground/30"
                      } ${opt.value === "friends_only" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      disabled={opt.value === "friends_only"}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-3 w-3 rounded-full border-2 ${
                            privacy.profileVisibility === opt.value
                              ? "border-primary bg-primary"
                              : "border-muted-foreground"
                          }`}
                        />
                        <span className="text-sm font-medium">{opt.label}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Shareable URL */}
              <div className="space-y-2">
                <div>
                  <div className="text-sm font-medium">Shareable Profile URL</div>
                  <div className="text-xs text-muted-foreground">
                    {privacy.profileVisibility === "private"
                      ? "Set your profile to Public to get a shareable link"
                      : "Share this link to let others see your achievements"}
                  </div>
                </div>
                {privacy.profileVisibility !== "private" && (
                  <div className="flex items-center gap-2">
                    <code className="flex-1 truncate rounded-md border bg-muted px-3 py-2 text-xs font-mono">
                      {typeof window !== "undefined"
                        ? `${window.location.origin}/profile/${privacy.profileVisibility === "public" ? "..." : ""}`
                        : ""}
                    </code>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyProfileUrl}
                      title="Copy profile URL"
                    >
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                )}
              </div>

              <Separator />

              {/* Toggles */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Show on Leaderboard</div>
                    <div className="text-xs text-muted-foreground">
                      Make your profile visible on the public leaderboard
                    </div>
                  </div>
                  <label className="relative inline-flex h-5 w-9 cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={privacy.showOnLeaderboard}
                      onChange={(e) => setPrivacy({ ...privacy, showOnLeaderboard: e.target.checked })}
                      className="peer sr-only"
                    />
                    <span className="absolute inset-0 rounded-full bg-muted-foreground/30 transition peer-checked:bg-primary" />
                    <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-4" />
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Share Learning Activity</div>
                    <div className="text-xs text-muted-foreground">
                      Let others see your courses, certificates, and streaks
                    </div>
                  </div>
                  <label className="relative inline-flex h-5 w-9 cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={privacy.shareLearningActivity}
                      onChange={(e) => setPrivacy({ ...privacy, shareLearningActivity: e.target.checked })}
                      className="peer sr-only"
                    />
                    <span className="absolute inset-0 rounded-full bg-muted-foreground/30 transition peer-checked:bg-primary" />
                    <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-4" />
                  </label>
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Could not load privacy settings</p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2">
          {saved ? "Saved!" : "Save Preferences"}
        </Button>
      </div>
    </div>
  )
}
