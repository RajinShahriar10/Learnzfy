"use client"

import { Star } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { StarRating } from "./star-rating"

interface RatingBreakdown {
  stars: number
  count: number
  percentage: number
}

interface RatingSummaryProps {
  average: number
  total: number
  breakdown: RatingBreakdown[]
}

export function RatingSummary({ average, total, breakdown }: RatingSummaryProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 p-5 rounded-lg border bg-muted/20">
      <div className="flex flex-col items-center justify-center min-w-[140px]">
        <span className="text-4xl font-bold">{average.toFixed(1)}</span>
        <StarRating value={Math.round(average)} size="md" />
        <span className="text-sm text-muted-foreground mt-1">
          {total} review{total !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex-1 space-y-1.5">
        {breakdown.map((item) => (
          <div key={item.stars} className="flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 w-16 shrink-0">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{item.stars}</span>
            </span>
            <Progress value={item.percentage} className="h-2 flex-1" />
            <span className="w-10 text-right text-muted-foreground text-xs tabular-nums">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
