// components/group/DashboardStatCard.tsx
"use client"

import { LucideIcon } from "lucide-react"

type DashboardStatCardProps = {
  icon: LucideIcon
  value: string | number
  label: string
  accent?: string // opsional: warna ikon/angka
}

export function DashboardStatCard({ icon: Icon, value, label, accent = "text-primary" }: DashboardStatCardProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted">
      <Icon className={`w-6 h-6 mb-2 ${accent}`} />
      <span className={`text-3xl font-bold ${accent}`}>{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}