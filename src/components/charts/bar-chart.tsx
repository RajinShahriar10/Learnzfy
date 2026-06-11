"use client"

import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"

interface BarChartProps {
  data: { label: string; value: number; [key: string]: string | number }[]
  dataKeys: { key: string; color: string; label: string }[]
  height?: number
  showGrid?: boolean
  stacked?: boolean
  layout?: "horizontal" | "vertical"
  formatY?: (val: number) => string
}

export function BarChart({
  data,
  dataKeys,
  height = 300,
  showGrid = true,
  stacked = false,
  layout = "horizontal",
  formatY,
}: BarChartProps) {
  if (layout === "vertical") {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBar data={data} layout="vertical" margin={{ top: 10, right: 10, left: 80, bottom: 0 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />}
          <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={formatY} />
          <YAxis type="category" dataKey="label" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "13px",
            }}
          />
          {dataKeys.map((dk) => (
            <Bar key={dk.key} dataKey={dk.key} name={dk.label} fill={dk.color} radius={[0, 4, 4, 0]} />
          ))}
        </RechartsBar>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBar data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />}
        <XAxis dataKey="label" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={{ stroke: "hsl(var(--border))" }} tickLine={false} />
        <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={formatY} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
            fontSize: "13px",
          }}
        />
        {dataKeys.map((dk) => (
          <Bar key={dk.key} dataKey={dk.key} name={dk.label} fill={dk.color} radius={[4, 4, 0, 0]} barSize={stacked ? undefined : 24} stackId={stacked ? "stack" : undefined} />
        ))}
      </RechartsBar>
    </ResponsiveContainer>
  )
}
