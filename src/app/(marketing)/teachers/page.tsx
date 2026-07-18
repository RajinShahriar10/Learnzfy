"use client"

import { useState, useEffect } from "react"
import { TeacherCard, type TeacherData } from "@/components/shared/teacher-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function TeachersPage() {
  const [search, setSearch] = useState("")
  const [specialty, setSpecialty] = useState("All")
  const [teachers, setTeachers] = useState<TeacherData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (specialty !== "All") params.set("specialty", specialty)

    setLoading(true)
    fetch(`/api/public/teachers?${params}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setTeachers(d.data)
      })
      .catch(() => setTeachers([]))
      .finally(() => setLoading(false))
  }, [search, specialty])

  const allSpecialties = [
    "All",
    ...Array.from(new Set(teachers.flatMap((t) => t.specialties))),
  ]

  return (
    <div className="min-h-screen">
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold tracking-tight">Our Teachers</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Learn from industry experts and passionate educators dedicated to
            your success.
          </p>
        </div>
      </section>

      <section className="py-8 border-b">
        <div className="container mx-auto px-4 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search teachers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {allSpecialties.map((s) => (
              <Badge
                key={s}
                variant={specialty === s ? "default" : "outline"}
                className="cursor-pointer transition-all hover:opacity-80"
                onClick={() => setSpecialty(s)}
              >
                {s}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-pulse text-muted-foreground">Loading teachers...</div>
            </div>
          ) : teachers.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">
                {search || specialty !== "All"
                  ? "No teachers match your search"
                  : "Teachers will appear here once they are approved"}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {teachers.map((teacher) => (
                <TeacherCard key={teacher.id} teacher={teacher} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
