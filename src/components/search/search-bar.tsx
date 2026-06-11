"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search, BookOpen, Users, FolderTree, Clock, TrendingUp, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Suggestion {
  text: string
  type: string
  link: string
}

interface PopularSearch {
  query: string
  count: number
}

interface RecentSearch {
  query: string
  createdAt: string
}

export function SearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [popular, setPopular] = useState<PopularSearch[]>([])
  const [recent, setRecent] = useState<RecentSearch[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [loading, setLoading] = useState(false)
  const [showTrending, setShowTrending] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setSuggestions([])
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(q)}`)
      if (res.ok) {
        const json = await res.json()
        setSuggestions(json.data || [])
      }
    } catch {
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchPopular = useCallback(async () => {
    try {
      const res = await fetch("/api/search/popular")
      if (res.ok) {
        const json = await res.json()
        setPopular(json.data || [])
      }
    } catch {
      //
    }
  }, [])

  const fetchRecent = useCallback(async () => {
    try {
      const res = await fetch("/api/search/recent")
      if (res.ok) {
        const json = await res.json()
        setRecent(json.data || [])
      }
    } catch {
      //
    }
  }, [])

  useEffect(() => {
    if (query.trim().length >= 2) {
      debounceRef.current = setTimeout(() => fetchSuggestions(query), 200)
    } else {
      setSuggestions([])
    }
    return () => clearTimeout(debounceRef.current)
  }, [query, fetchSuggestions])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setShowTrending(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleFocus = () => {
    setIsOpen(true)
    if (query.trim().length < 2) {
      setShowTrending(true)
      fetchPopular()
      fetchRecent()
    }
  }

  const handleSubmit = (searchQuery?: string) => {
    const q = searchQuery || query
    if (!q.trim()) return
    setIsOpen(false)
    setShowTrending(false)
    router.push(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length + (showTrending && query.length < 2 ? (recent.length + popular.length) : 0) - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, -1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        const s = suggestions[selectedIndex]
        setIsOpen(false)
        setShowTrending(false)
        router.push(s.link)
      } else {
        handleSubmit()
      }
    } else if (e.key === "Escape") {
      setIsOpen(false)
      setShowTrending(false)
      inputRef.current?.blur()
    }
  }

  const typeIcons: Record<string, React.ReactNode> = {
    Course: <BookOpen className="h-3.5 w-3.5 text-primary" />,
    Teacher: <Users className="h-3.5 w-3.5 text-emerald-500" />,
    Category: <FolderTree className="h-3.5 w-3.5 text-orange-500" />,
  }

  const totalSuggestions = suggestions.length
  const totalRecent = recent.length
  const totalPopular = popular.length
  const trendingCount = showTrending && query.length < 2 ? totalRecent + totalPopular : 0

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search courses, teachers, lessons..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowTrending(false)
            setSelectedIndex(-1)
            if (e.target.value.trim().length >= 2) setIsOpen(true)
          }}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          className="pl-9 pr-10 h-10 bg-muted/50 border-muted focus-visible:bg-background"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin" />
        )}
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 rounded-lg border bg-popover p-2 shadow-lg animate-in fade-in-0 zoom-in-95"
        >
          {/* Autocomplete suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-0.5 mb-2">
              <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                Suggestions
              </div>
              {suggestions.map((s, i) => (
                <button
                  key={`${s.type}-${s.text}`}
                  onClick={() => {
                    setIsOpen(false)
                    setShowTrending(false)
                    router.push(s.link)
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors text-left",
                    i === selectedIndex ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                  )}
                >
                  {typeIcons[s.type] || <Search className="h-3.5 w-3.5 text-muted-foreground" />}
                  <span className="flex-1 truncate">{s.text}</span>
                  <span className="text-[11px] text-muted-foreground shrink-0">{s.type}</span>
                </button>
              ))}
            </div>
          )}

          {/* Recent searches */}
          {showTrending && query.length < 2 && recent.length > 0 && (
            <div className="space-y-0.5 mb-2">
              <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                Recent
              </div>
              {recent.slice(0, 5).map((r, i) => {
                const idx = suggestions.length + i
                return (
                  <button
                    key={r.query}
                    onClick={() => {
                      setQuery(r.query)
                      handleSubmit(r.query)
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors text-left",
                      idx === selectedIndex ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                    )}
                  >
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="flex-1 truncate">{r.query}</span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Popular searches */}
          {showTrending && query.length < 2 && popular.length > 0 && (
            <div className="space-y-0.5">
              <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-1.5">
                <TrendingUp className="h-3 w-3" />
                Popular
              </div>
              {popular.slice(0, 5).map((p, i) => {
                const idx = suggestions.length + totalRecent + i
                return (
                  <button
                    key={p.query}
                    onClick={() => {
                      setQuery(p.query)
                      handleSubmit(p.query)
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors text-left",
                      idx === selectedIndex ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                    )}
                  >
                    <TrendingUp className="h-3.5 w-3.5 text-orange-500" />
                    <span className="flex-1 truncate">{p.query}</span>
                    <span className="text-[11px] text-muted-foreground">{p.count} searches</span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Empty state */}
          {query.trim().length >= 2 && suggestions.length === 0 && !loading && (
            <div className="px-2 py-6 text-center text-sm text-muted-foreground">
              No results for &ldquo;{query}&rdquo;
            </div>
          )}

          {/* Search all link */}
          {query.trim().length >= 2 && (
            <div className="border-t mt-2 pt-2">
              <button
                onClick={() => handleSubmit()}
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-primary hover:bg-accent/50 transition-colors"
              >
                <Search className="h-4 w-4" />
                Search for &ldquo;{query}&rdquo;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
