"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react"

interface ThumbnailUploaderProps {
  value?: string | null
  onChange: (url: string | null) => void
  label?: string
}

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]

export function ThumbnailUploader({ value, onChange, label = "Course Thumbnail" }: ThumbnailUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (file: File) => {
    setError(null)

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPG, PNG, WEBP, GIF, and AVIF images are allowed")
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Image size must be 5MB or less")
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed")
      }

      onChange(data.data.url)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center">
        {value ? (
          <div className="w-full space-y-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt={label}
              className="mx-auto aspect-video w-full max-w-xs rounded-md object-cover"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onChange(null)
                if (inputRef.current) inputRef.current.value = ""
              }}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Remove
            </Button>
          </div>
        ) : (
          <>
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/60" />
            ) : (
              <UploadCloud className="h-8 w-8 text-muted-foreground/50" />
            )}
            {!uploading && (
              <>
                <p className="mt-2 text-sm text-muted-foreground">
                  Drag & drop or click to upload
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  PNG, JPG, WebP (max 5MB)
                </p>
              </>
            )}
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
        onClick={(e) => {
          e.currentTarget.value = ""
        }}
      />

      {!value && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <ImagePlus className="mr-1.5 h-3.5 w-3.5" />
              Choose File
            </>
          )}
        </Button>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}