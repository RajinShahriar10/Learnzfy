"use client"

import { useState } from "react"
import type { LessonNote } from "@/lib/lesson-data"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Clock, Bookmark } from "lucide-react"

interface NotesPanelProps {
  notes: LessonNote[]
  onAddNote: (content: string, timestamp: number) => void
  onDeleteNote: (noteId: string) => void
}

export function NotesPanel({ notes, onAddNote, onDeleteNote }: NotesPanelProps) {
  const [newNote, setNewNote] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return
    onAddNote(newNote.trim(), 0)
    setNewNote("")
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note..."
          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
        />
        <Button type="submit" size="sm" disabled={!newNote.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      <div className="space-y-2">
        {notes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bookmark className="h-8 w-8 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">
              No notes yet. Add notes while watching the lesson.
            </p>
          </div>
        )}
        {notes
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((note) => (
            <div
              key={note.id}
              className="group flex items-start gap-3 rounded-lg border bg-background p-3"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-muted">
                <Clock className="h-3 w-3 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm">{note.content}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>
                    {new Date(note.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 text-destructive"
                onClick={() => onDeleteNote(note.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
      </div>
    </div>
  )
}
