"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Award, Loader2 } from "lucide-react"

interface GenerateCertificateButtonProps {
  courseId: string
  examId?: string
  grade?: string
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function GenerateCertificateButton({
  courseId,
  examId,
  grade,
  variant = "default",
  size = "default",
  className,
}: GenerateCertificateButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, examId, grade }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to generate certificate")
      }

      const cert = await res.json()
      router.push(`/student/certificates/${cert.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div className={className}>
      <Button
        variant={variant}
        size={size}
        onClick={handleGenerate}
        disabled={loading}
        className="gap-2"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Award className="h-4 w-4" />
        )}
        {loading ? "Generating..." : "Get Certificate"}
      </Button>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}
