"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Upload } from "lucide-react"
import Link from "next/link"

const categories = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Design",
  "Business",
  "Marketing",
]

const difficulties = ["beginner", "intermediate", "advanced"] as const

export default function CreateCoursePage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [category, setCategory] = useState(categories[0])
  const [difficulty, setDifficulty] = useState<(typeof difficulties)[number]>("beginner")
  const [duration, setDuration] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/teacher/courses")
  }

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href="/teacher/courses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create New Course</h1>
        <p className="mt-1 text-muted-foreground">
          Fill in the details below to create your course
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="title">Course Title</Label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Complete Web Development Bootcamp"
                    className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="shortDescription">Short Description</Label>
                  <input
                    id="shortDescription"
                    type="text"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="A brief tagline for your course"
                    className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Full Description</Label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what students will learn in this course..."
                    rows={5}
                    className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-y"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <select
                      id="difficulty"
                      value={difficulty}
                      onChange={(e) =>
                        setDifficulty(
                          e.target.value as (typeof difficulties)[number]
                        )
                      }
                      className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {difficulties.map((d) => (
                        <option key={d} value={d} className="capitalize">
                          {d.charAt(0).toUpperCase() + d.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="duration">Estimated Duration</Label>
                  <input
                    id="duration"
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 12 weeks"
                    className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <Label>Course Thumbnail</Label>
                <div className="mt-2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Drag & drop or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    PNG, JPG, or WebP (max 5MB)
                  </p>
                  <Button type="button" variant="outline" size="sm" className="mt-4">
                    Choose File
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold">Course Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-sm">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span>Free course (no pricing)</span>
                  </label>
                  <label className="flex items-center gap-3 text-sm">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span>Certificate on completion</span>
                  </label>
                  <label className="flex items-center gap-3 text-sm">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span>Show on public listing</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/teacher/courses">Cancel</Link>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
