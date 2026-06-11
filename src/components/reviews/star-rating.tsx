"use client"

import { useState } from "react"
import { Star } from "lucide-react"

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  size?: "sm" | "md" | "lg"
  interactive?: boolean
  showValue?: boolean
}

export function StarRating({
  value,
  onChange,
  size = "md",
  interactive = false,
  showValue = false,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0)

  const sizeMap = { sm: "h-3.5 w-3.5", md: "h-5 w-5", lg: "h-7 w-7" }
  const starClass = sizeMap[size]

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = interactive ? star <= (hovered || value) : star <= value
        const partial = !filled && !interactive && value > star - 1 && value < star

        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            onClick={() => interactive && onChange?.(star)}
            className={cn(
              "transition-colors",
              interactive
                ? "cursor-pointer hover:scale-110"
                : "cursor-default",
              filled ? "text-yellow-400" : partial ? "text-yellow-400/50" : "text-muted-foreground/30"
            )}
            aria-label={`${star} star${star !== 1 ? "s" : ""}`}
          >
            <Star
              className={cn(
                starClass,
                filled && "fill-yellow-400"
              )}
            />
          </button>
        )
      })}
      {showValue && (
        <span className="ml-1.5 text-sm font-medium text-muted-foreground">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  )
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}
