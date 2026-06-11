"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Save, Flame, BarChart3, Users, Award, Activity } from "lucide-react"

const CONFIG_KEYS = [
  { key: "multiplier_2", label: "2-Day Streak Multiplier", desc: "XP multiplier when streak ≥2 days", min: 1, max: 10, step: 0.5 },
  { key: "multiplier_5", label: "5-Day Streak Multiplier", desc: "XP multiplier when streak ≥5 days", min: 1, max: 10, step: 0.5 },
  { key: "multiplier_10", label: "10-Day Streak Multiplier", desc: "XP multiplier when streak ≥10 days", min: 1, max: 10, step: 0.5 },
  { key: "multiplier_30", label: "30-Day Streak Multiplier", desc: "XP multiplier when streak ≥30 days", min: 1, max: 10, step: 0.5 },
  { key: "milestone_1", label: "1 Day Milestone XP", desc: "XP awarded for 1-day milestone", min: 0, max: 1000, step: 5 },
  { key: "milestone_7", label: "7 Day Milestone XP", desc: "XP awarded for 7-day milestone", min: 0, max: 5000, step: 10 },
  { key: "milestone_14", label: "14 Day Milestone XP", desc: "XP awarded for 14-day milestone", min: 0, max: 5000, step: 10 },
  { key: "milestone_30", label: "30 Day Milestone XP", desc: "XP awarded for 30-day milestone", min: 0, max: 10000, step: 25 },
  { key: "milestone_60", label: "60 Day Milestone XP", desc: "XP awarded for 60-day milestone", min: 0, max: 10000, step: 25 },
  { key: "milestone_100", label: "100 Day Milestone XP", desc: "XP awarded for 100-day milestone", min: 0, max: 50000, step: 50 },
  { key: "milestone_365", label: "365 Day Milestone XP", desc: "XP awarded for 365-day milestone", min: 0, max: 100000, step: 100 },
]

export default function AdminStreakPage() {
  const [config, setConfig] = useState<Record<string, number>>({})
  const [stats, setStats] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const fetchConfig = useCallback(async () => {
    try {
      const [configRes, statsRes] = await Promise.all([
        fetch("/api/streak/config"),
        fetch("/api/streak/stats"),
      ])
      if (configRes.ok) setConfig((await configRes.json()).data)
      if (statsRes.ok) setStats((await statsRes.json()).data)
    } catch {
      //
    }
  }, [])

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

  const handleSave = async () => {
    setSaving(true)
    setMessage("")
    try {
      const res = await fetch("/api/streak/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })
      if (res.ok) {
        setMessage("Configuration saved")
      } else {
        setMessage("Failed to save")
      }
    } catch {
      setMessage("Error saving configuration")
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(""), 3000)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Flame className="h-6 w-6 text-orange-500" />
          Streak System
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure streak XP multipliers and milestone rewards
        </p>
      </div>

      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
                <p className="text-xs text-muted-foreground">Total Students</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Activity className="h-8 w-8 text-emerald-500" />
              <div>
                <p className="text-2xl font-bold">{stats.activeToday}</p>
                <p className="text-xs text-muted-foreground">Active Today</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.activeThisWeek}</p>
                <p className="text-xs text-muted-foreground">Active This Week</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Award className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalMilestonesAwarded}</p>
                <p className="text-xs text-muted-foreground">Milestones Awarded</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-3">XP Multipliers</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {CONFIG_KEYS.filter((k) => k.key.startsWith("multiplier")).map((item) => (
              <Card key={item.key}>
                <CardContent className="p-4">
                  <label className="text-sm font-medium">{item.label}</label>
                  <p className="text-xs text-muted-foreground mb-2">{item.desc}</p>
                  <Input
                    type="number"
                    min={item.min}
                    max={item.max}
                    step={item.step}
                    value={config[item.key] ?? 1}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, [item.key]: parseFloat(e.target.value) || 1 }))
                    }
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Milestone XP Rewards</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CONFIG_KEYS.filter((k) => k.key.startsWith("milestone")).map((item) => (
              <Card key={item.key}>
                <CardContent className="p-4">
                  <label className="text-sm font-medium">{item.label}</label>
                  <p className="text-xs text-muted-foreground mb-2">{item.desc}</p>
                  <Input
                    type="number"
                    min={item.min}
                    max={item.max}
                    step={item.step}
                    value={config[item.key] ?? 0}
                    onChange={(e) =>
                      setConfig((prev) => ({ ...prev, [item.key]: parseInt(e.target.value) || 0 }))
                    }
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Configuration"}
          </Button>
          {message && (
            <Badge variant={message === "Configuration saved" ? "default" : "destructive"}>
              {message}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
