"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Play, Pause, Maximize, Volume2 } from "lucide-react"

interface VideoPlayerProps {
  youtubeUrl: string
  onProgress: (progress: number) => void
  initialProgress?: number
}

export function VideoPlayer({ youtubeUrl, onProgress, initialProgress = 0 }: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(initialProgress)
  const progressInterval = useRef<ReturnType<typeof setInterval>>(undefined)

  const updateProgress = useCallback(() => {
    setProgress((prev) => {
      const next = Math.min(prev + 1, 100)
      onProgress(next)
      return next
    })
  }, [onProgress])

  const togglePlay = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current
      if (isPlaying) {
        iframe.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*")
        clearInterval(progressInterval.current)
      } else {
        iframe.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', "*")
        progressInterval.current = setInterval(updateProgress, 3000)
      }
      setIsPlaying(!isPlaying)
    }
  }

  useEffect(() => {
    return () => clearInterval(progressInterval.current)
  }, [])

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden group">
      <iframe
        ref={iframeRef}
        src={`${youtubeUrl}?enablejsapi=1&autoplay=0&rel=0`}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="h-1 bg-white/20 rounded-full mb-3 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            onClick={togglePlay}
            className="flex items-center gap-2 text-white text-sm font-medium hover:text-primary transition-colors"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 fill-current" />
            ) : (
              <Play className="h-5 w-5 fill-current" />
            )}
            {isPlaying ? "Pause" : "Play"}
          </button>
          <div className="flex items-center gap-3">
            <span className="text-white/80 text-xs">
              {initialProgress > 0 ? `${initialProgress}% watched` : `${progress}%`}
            </span>
            <Volume2 className="h-4 w-4 text-white/60" />
            <Maximize className="h-4 w-4 text-white/60" />
          </div>
        </div>
      </div>
    </div>
  )
}
