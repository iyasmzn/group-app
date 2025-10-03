"use client"

import { Clock } from "lucide-react"

type Props = {
  start: string
  end?: string
  compact?: boolean
  calendarMode?: boolean
  labels?: {
    upcoming?: string
    ongoing?: string
    past?: string
  }
}

export function EventStatusBadge({
  start,
  end,
  compact = false,
  calendarMode = false,
  labels,
}: Props) {
  const startDate = new Date(start)
  const endDate = end ? new Date(end) : undefined
  const now = new Date()

  // Tentukan status
  let status: "Upcoming" | "Ongoing" | "Past" = "Upcoming"
  if (endDate && now > endDate) status = "Past"
  else if (endDate && now >= startDate && now <= endDate) status = "Ongoing"
  else if (!endDate && now > startDate) status = "Past"

  // Label custom
  const statusLabel =
    status === "Upcoming"
      ? labels?.upcoming ?? "Upcoming"
      : status === "Ongoing"
      ? labels?.ongoing ?? "Ongoing"
      : labels?.past ?? "Past"

  // Warna badge
  const badgeColor =
    status === "Upcoming"
      ? "bg-blue-100 text-blue-700"
      : status === "Ongoing"
      ? "bg-green-100 text-green-700"
      : "bg-gray-200 text-gray-700"

  // Compact mode → hanya badge
  if (compact) {
    return (
      <span
        className={`px-2 py-0.5 rounded text-xs font-medium ${badgeColor}`}
      >
        {statusLabel}
      </span>
    )
  }

  // Calendar mode → hanya tanggal (tanpa jam)
  if (calendarMode) {
    const display = endDate
      ? `${startDate.toLocaleDateString("id-ID", { dateStyle: "medium" })} s/d ${endDate.toLocaleDateString("id-ID", { dateStyle: "medium" })}`
      : startDate.toLocaleDateString("id-ID", { dateStyle: "medium" })

    return (
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {display}
        </span>
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium ${badgeColor}`}
        >
          {statusLabel}
        </span>
      </div>
    )
  }

  // Default mode → logika lengkap
  const sameDay = endDate && startDate.toDateString() === endDate.toDateString()
  const sameTime =
    endDate &&
    startDate.getHours() === endDate.getHours() &&
    startDate.getMinutes() === endDate.getMinutes()

  // 🔧 Aturan khusus: full-day event (00:00 – 23:59)
  const isFullDay =
    endDate &&
    sameDay &&
    startDate.getHours() === 0 &&
    startDate.getMinutes() === 0 &&
    endDate.getHours() === 23 &&
    endDate.getMinutes() === 59

  let display: string
  if (!endDate) {
    display = startDate.toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    })
  } else if (sameDay) {
    if (isFullDay) {
      display = startDate.toLocaleDateString("id-ID", { dateStyle: "medium" })
    } else if (sameTime) {
      display = `${startDate.toLocaleDateString("id-ID", {
        dateStyle: "medium",
      })}, ${startDate.toLocaleTimeString("id-ID", { timeStyle: "short" })}`
    } else {
      display = `${startDate.toLocaleDateString("id-ID", {
        dateStyle: "medium",
      })}, ${startDate.toLocaleTimeString("id-ID", {
        timeStyle: "short",
      })} – ${endDate.toLocaleTimeString("id-ID", { timeStyle: "short" })}`
    }
  } else {
    display = `${startDate.toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    })} s/d ${endDate.toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    })}`
  }

  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1">
        <Clock className="w-4 h-4" />
        {display}
      </span>
      <span
        className={`px-2 py-0.5 rounded text-xs font-medium ${badgeColor}`}
      >
        {statusLabel}
      </span>
    </div>
  )
}