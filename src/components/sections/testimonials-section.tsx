"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

interface Testimonial {
  id: string
  name: string
  role: string
  content: string | null
  rating: number
}

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    fetch("/api/public/reviews?limit=10")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data?.length > 0) {
          setTestimonials(d.data)
        }
      })
      .catch(() => {})
  }, [])

  if (testimonials.length === 0) return null

  const t = testimonials[current]
  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1))

  const initials = (t.name || "A")
    .split(" ")
    .map((n) => n[0])
    .join("")

  return (
    <section className="py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">
            What Our Students Say
          </h2>
          <p className="mt-2 text-muted-foreground">
            Hear from the Learnzfy community
          </p>
        </div>
        <div className="mx-auto max-w-2xl">
          <Card className="relative p-8 md:p-12 text-center">
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <blockquote className="text-lg md:text-xl leading-relaxed mb-8">
              &ldquo;{t.content}&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="text-sm">{initials}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <div className="font-semibold">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.role}</div>
              </div>
            </div>
            {testimonials.length > 1 && (
              <>
                <div className="absolute top-1/2 -translate-y-1/2 left-2 md:left-4">
                  <button
                    onClick={prev}
                    className="flex h-10 w-10 items-center justify-center rounded-full border bg-background hover:bg-muted transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 right-2 md:right-4">
                  <button
                    onClick={next}
                    className="flex h-10 w-10 items-center justify-center rounded-full border bg-background hover:bg-muted transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </>
            )}
          </Card>
          {testimonials.length > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    i === current
                      ? "bg-primary w-6"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
