"use client"

import { useEffect, useRef } from "react"

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  fallback?: string
}

export function LazyImage({ src, alt, fallback, className, ...props }: LazyImageProps) {
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const el = imgRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.src = src
          observer.disconnect()
        }
      },
      { rootMargin: "200px" },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [src])

  function handleError(e: React.SyntheticEvent<HTMLImageElement>) {
    if (fallback) {
      e.currentTarget.src = fallback
    }
  }

  return (
    <img
      ref={imgRef}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  )
}
