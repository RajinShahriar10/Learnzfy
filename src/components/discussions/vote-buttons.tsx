"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface VoteButtonsProps {
  upvotes: number
  hasUpvoted: boolean
  onVote: () => Promise<void>
  size?: "sm" | "md"
}

export function VoteButtons({ upvotes, hasUpvoted: initial, onVote, size = "md" }: VoteButtonsProps) {
  const [upvoted, setUpvoted] = useState(initial)
  const [count, setCount] = useState(upvotes)
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    setUpvoted(!upvoted)
    setCount((c) => c + (upvoted ? -1 : 1))
    try {
      const res = await onVote()
    } catch {
      setUpvoted(upvoted)
      setCount(count)
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center gap-0.5">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-7 w-7 p-0",
          size === "sm" && "h-6 w-6"
        )}
        onClick={handleClick}
        disabled={loading}
      >
        <ChevronUp
          className={cn(
            size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4",
            upvoted && "text-primary",
            "transition-colors"
          )}
        />
      </Button>
      <span
        className={cn(
          "text-xs font-medium tabular-nums leading-none",
          upvoted ? "text-primary" : "text-muted-foreground"
        )}
      >
        {count}
      </span>
    </div>
  )
}
