"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Props = {
  value?: string // format "HH:MM"
  onChange: (val: string) => void
}

export function TimePicker24({ value = "00:00", onChange }: Props) {
  const [h, m] = value.split(":").map(Number)

  return (
    <div className="flex gap-2">
      {/* Jam */}
      <Select
        value={String(h).padStart(2, "0")}
        onValueChange={(val) => onChange(`${val}:${String(m).padStart(2, "0")}`)}
      >
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder="Jam" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 24 }).map((_, i) => {
            const hh = String(i).padStart(2, "0")
            return (
              <SelectItem key={i} value={hh}>
                {hh}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>

      {/* Menit */}
      <Select
        value={String(m).padStart(2, "0")}
        onValueChange={(val) => onChange(`${String(h).padStart(2, "0")}:${val}`)}
      >
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder="Menit" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 60 }).map((_, i) => {
            const mm = String(i).padStart(2, "0")
            return (
              <SelectItem key={i} value={mm}>
                {mm}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}