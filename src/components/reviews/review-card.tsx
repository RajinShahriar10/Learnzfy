"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { StarRating } from "./star-rating"
import { MoreHorizontal, Pencil, Trash2, Flag } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ReviewCardProps {
  id: string
  userName: string
  userAvatar?: string | null
  rating: number
  comment: string | null
  createdAt: string
  isEdited: boolean
  isOwner: boolean
  isAdmin?: boolean
  isHidden?: boolean
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onReport?: (id: string) => void
  onToggleHide?: (id: string, hidden: boolean) => void
}

export function ReviewCard({
  id,
  userName,
  userAvatar,
  rating,
  comment,
  createdAt,
  isEdited,
  isOwner,
  isAdmin,
  isHidden,
  onEdit,
  onDelete,
  onReport,
  onToggleHide,
}: ReviewCardProps) {
  const [showFullComment, setShowFullComment] = useState(false)
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const isLong = (comment?.length ?? 0) > 280
  const displayComment = showFullComment || !isLong
    ? comment
    : comment?.slice(0, 280) + "..."

  return (
    <div className={cn(
      "flex gap-3 p-4 rounded-lg border",
      isHidden && "opacity-50 bg-muted/20"
    )}>
      <Avatar className="h-9 w-9 shrink-0">
        <AvatarFallback className="text-xs bg-primary/10 text-primary">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-semibold truncate">{userName}</span>
            <StarRating value={rating} size="sm" />
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-xs text-muted-foreground">
              {formatDate(createdAt)}
            </span>
            {(isOwner || isAdmin) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  {isOwner && onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(id)}>
                      <Pencil className="h-3.5 w-3.5 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {isOwner && onDelete && (
                    <DropdownMenuItem
                      onClick={() => onDelete(id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                  {isAdmin && onToggleHide && (
                    <DropdownMenuItem onClick={() => onToggleHide(id, !isHidden)}>
                      {isHidden ? "Unhide" : "Hide"}
                    </DropdownMenuItem>
                  )}
                  {isAdmin && onDelete && (
                    <DropdownMenuItem
                      onClick={() => onDelete(id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {!isOwner && onReport && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onReport(id)}
                title="Report"
              >
                <Flag className="h-3.5 w-3.5 text-muted-foreground/60" />
              </Button>
            )}
          </div>
        </div>
        {isEdited && (
          <span className="text-[11px] text-muted-foreground/50 italic">(edited)</span>
        )}
        {isHidden && (
          <span className="text-[11px] text-amber-600 ml-2">(hidden)</span>
        )}
        {comment && (
          <div className="mt-1.5">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
              {displayComment}
            </p>
            {isLong && (
              <button
                onClick={() => setShowFullComment(!showFullComment)}
                className="text-xs text-primary hover:underline mt-0.5"
              >
                {showFullComment ? "Show less" : "Read more"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const diff = Date.now() - date.getTime()
  const days = Math.floor(diff / 86400000)

  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}
