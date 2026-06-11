"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  current: number
  total: number
  onPageChange: (page: number) => void
}

export function Pagination({ current, total, onPageChange }: PaginationProps) {
  if (total <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <Button
        variant="outline"
        size="sm"
        disabled={current === 1}
        onClick={() => onPageChange(current - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {Array.from({ length: total }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          variant={page === current ? "default" : "outline"}
          size="sm"
          className="h-9 w-9 p-0"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}
      <Button
        variant="outline"
        size="sm"
        disabled={current === total}
        onClick={() => onPageChange(current + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
