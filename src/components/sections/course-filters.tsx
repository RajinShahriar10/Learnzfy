"use client"

import { useState, useEffect } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Category {
  id: string
  name: string
  slug: string
}

interface CourseFiltersProps {
  search: string
  category: string
  difficulty: string
  onSearchChange: (v: string) => void
  onCategoryChange: (v: string) => void
  onDifficultyChange: (v: string) => void
}

export function CourseFilters({
  search,
  category,
  difficulty,
  onSearchChange,
  onCategoryChange,
  onDifficultyChange,
}: CourseFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetch("/api/public/categories")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCategories(d.data)
      })
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-11"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={category === "All" ? "default" : "outline"}
          className="cursor-pointer transition-all hover:opacity-80"
          onClick={() => onCategoryChange("All")}
        >
          All
        </Badge>
        {categories.map((cat) => (
          <Badge
            key={cat.id}
            variant={category === cat.slug ? "default" : "outline"}
            className="cursor-pointer transition-all hover:opacity-80"
            onClick={() => onCategoryChange(cat.slug)}
          >
            {cat.name}
          </Badge>
        ))}
      </div>
      <div className="flex items-center gap-2 text-sm">
        <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">Difficulty:</span>
        {["all", "beginner", "intermediate", "advanced"].map((d) => (
          <Button
            key={d}
            variant={difficulty === d ? "default" : "ghost"}
            size="sm"
            className="h-8 capitalize"
            onClick={() => onDifficultyChange(d)}
          >
            {d}
          </Button>
        ))}
      </div>
    </div>
  )
}
