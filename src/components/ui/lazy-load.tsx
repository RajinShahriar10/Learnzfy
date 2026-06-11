"use client"

import { useEffect, useRef, useState } from "react"

interface LazyLoadProps {
  children: React.ReactNode
  className?: string
  threshold?: number
  placeholder?: React.ReactNode
}

export function LazyLoad({
  children,
  className,
  threshold = 0.1,
  placeholder,
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : placeholder ?? <div className="min-h-[100px]" />}
    </div>
  )
}
