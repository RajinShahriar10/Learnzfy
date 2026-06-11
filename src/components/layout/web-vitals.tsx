"use client"

import { useReportWebVitals } from "next/web-vitals"

export function WebVitals() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV !== "production") return

    const body = {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
      url: window.location.href,
    }

    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/vitals", JSON.stringify(body))
    } else {
      fetch("/api/vitals", {
        method: "POST",
        body: JSON.stringify(body),
        keepalive: true,
      })
    }
  })

  return null
}
