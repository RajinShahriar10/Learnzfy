"use client"

import { QRCodeSVG } from "qrcode.react"

export function QRCodeDisplay({ url, size = 120 }: { url: string; size?: number }) {
  return (
    <div className="inline-flex flex-col items-center gap-2 rounded-xl border bg-white p-3">
      <QRCodeSVG value={url} size={size} level="M" includeMargin={false} />
      <p className="text-[10px] text-muted-foreground text-center leading-tight max-w-[140px] break-all">
        Scan to verify
      </p>
    </div>
  )
}
