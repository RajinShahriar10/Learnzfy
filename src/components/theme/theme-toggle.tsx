"use client"

import { useTheme } from "@/providers/theme-provider"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Monitor, ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, resolved, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const options: { value: typeof theme; label: string; icon: typeof Sun }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ]

  const currentIcon = options.find((o) => o.value === theme)?.icon ?? Sun
  const Icon = currentIcon

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        className="gap-2 h-9 px-3"
        aria-label={`Theme: ${theme}. Click to change.`}
        title={`Theme: ${theme}`}
      >
        <Icon className="h-4 w-4" />
        <span className="hidden sm:inline text-xs capitalize">{theme === "system" ? "Auto" : theme}</span>
        <ChevronDown className={cn("h-3 w-3 transition-transform", open && "rotate-180")} />
      </Button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-36 rounded-lg border bg-popover p-1 shadow-lg animate-in fade-in-0 zoom-in-95">
          {options.map((opt) => {
            const OptIcon = opt.icon
            const isActive = theme === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => {
                  setTheme(opt.value)
                  setOpen(false)
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                role="menuitemradio"
                aria-checked={isActive}
              >
                <OptIcon className="h-4 w-4 shrink-0" />
                <span className="flex-1 text-left">{opt.label}</span>
                {isActive && (
                  <span className="h-2 w-2 rounded-full bg-primary" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function ThemeToggleIcon() {
  const { theme, resolved, toggle } = useTheme()

  const Icon = resolved === "dark" ? Moon : Sun

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className="h-9 w-9 p-0"
      aria-label={`Current theme: ${resolved}. Toggle theme.`}
      title="Toggle theme"
    >
      <Icon className="h-4 w-4" />
    </Button>
  )
}
