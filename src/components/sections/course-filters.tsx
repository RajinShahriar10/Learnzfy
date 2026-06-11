"use client"

import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { categories } from "@/lib/mock-data"

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
        {categories.map((cat) => (
          <Badge
            key={cat}
            variant={category === cat ? "default" : "outline"}
            className="cursor-pointer transition-all hover:opacity-80"
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
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
