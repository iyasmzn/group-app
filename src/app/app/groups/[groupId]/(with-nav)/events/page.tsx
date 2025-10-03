"use client"

import { useEffect, useState } from "react"
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Plus,
  SortAsc,
  SortDesc,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Reveal from "@/components/animations/Reveal"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { useRealtimeTable } from "@/lib/hooks/useRealtimeTable"
import { Skeleton } from "@/components/ui/skeleton"
import { eventService, GroupEvent } from "@/services/eventService/eventService"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function EventsPage() {
  const { groupId } = useParams() as { groupId: string }
  const [events, setEvents] = useState<GroupEvent[]>([])
  const [loading, setLoading] = useState(true)

  // sorting & pagination state
  const [orderBy, setOrderBy] = useState<
    "created_at" | "start_at" | "end_at"
  >("created_at")
  const [orderDir, setOrderDir] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState(1)
  const limit = 5

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const data = await eventService.read(
        { group_id: groupId },
        {
          orderBy,
          orderDir,
          limit,
          offset: (page - 1) * limit,
        }
      )
      setEvents(data)
    } catch (err) {
      console.error("Error fetching events:", err)
    } finally {
      setLoading(false)
    }
  }

  // initial + refetch on sort/page change
  useEffect(() => {
    fetchEvents()
  }, [groupId, orderBy, orderDir, page])

  // realtime subscription
  useRealtimeTable<GroupEvent>({
    supabase,
    table: "group_events",
    filter: `group_id=eq.${groupId}`,
    onInsert: () => fetchEvents(),
    onUpdate: () => fetchEvents(),
    onDelete: () => fetchEvents(),
  })

  return (
    <div className="p-4 space-y-6 relative min-h-screen">
      {/* Header + tombol create */}
      <div className="flex items-center justify-between">
        <Reveal animation="fadeInDown">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6" /> Events
          </h1>
        </Reveal>

        <Reveal animation="fadeInDown">
          <Link href={`./events/create`}>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Buat Event
            </Button>
          </Link>
        </Reveal>
      </div>

      {/* Sorting controls */}
      <div className="flex items-center gap-4">
        <Select value={orderBy} onValueChange={(v: any) => setOrderBy(v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Urutkan berdasarkan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Created At</SelectItem>
            <SelectItem value="start_at">Start At</SelectItem>
            <SelectItem value="end_at">End At</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setOrderDir(orderDir === "asc" ? "desc" : "asc")}
        >
          {orderDir === "asc" ? (
            <SortAsc className="w-4 h-4" />
          ) : (
            <SortDesc className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Daftar event */}
      <div className="space-y-4">
        {loading &&
          Array.from({ length: limit }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-lg border p-4 shadow-sm bg-white dark:bg-neutral-900 space-y-3"
            >
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}

        {!loading && events.length === 0 && (
          <p className="text-muted-foreground">Belum ada event.</p>
        )}

        {events.map((event, idx) => (
          <Reveal key={event.id} animation="fadeInUp" delay={0.05 * idx}>
            <Link
              href={`./events/${event.id}`}
              className="block rounded-lg border p-4 shadow-sm hover:shadow-md transition bg-white dark:bg-neutral-900"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">{event.title}</h2>
                <span className="text-xs text-muted-foreground">
                  Dibuat{" "}
                  {event.created_at &&
                    new Date(event.created_at).toLocaleDateString("id-ID")}
                </span>
              </div>

              {event.description && (
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {event.description}
                </p>
              )}

              <div className="flex flex-wrap gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                {event.start_at && (
                  (() => {
                    const start = new Date(event.start_at)
                    const end = event.end_at ? new Date(event.end_at) : null
                    const now = new Date()

                    // Tentukan status
                    let status: "Upcoming" | "Ongoing" | "Past" = "Upcoming"
                    if (end && now > end) status = "Past"
                    else if (end && now >= start && now <= end) status = "Ongoing"
                    else if (!end && now > start) status = "Past"

                    // Badge warna
                    const badgeColor =
                      status === "Upcoming"
                        ? "bg-blue-100 text-blue-700"
                        : status === "Ongoing"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"

                    // Jika tidak ada end → tampilkan start saja
                    if (!end) {
                      return (
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {start.toLocaleString("id-ID", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${badgeColor}`}>
                            {status}
                          </span>
                        </div>
                      )
                    }

                    // Jika sama hari
                    const sameDay = start.toDateString() === end.toDateString()
                    if (sameDay) {
                      const sameTime = start.getHours() === end.getHours() && start.getMinutes() === end.getMinutes()
                      return (
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {start.toLocaleDateString("id-ID", { dateStyle: "medium" })},{" "}
                            {sameTime
                              ? start.toLocaleTimeString("id-ID", { timeStyle: "short" })
                              : `${start.toLocaleTimeString("id-ID", { timeStyle: "short" })} – ${end.toLocaleTimeString("id-ID", { timeStyle: "short" })}`}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${badgeColor}`}>
                            {status}
                          </span>
                        </div>
                      )
                    }

                    // Kalau beda hari → tampilkan rentang
                    return (
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {start.toLocaleString("id-ID", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}{" "}
                          s/d{" "}
                          {end.toLocaleString("id-ID", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${badgeColor}`}>
                          {status}
                        </span>
                      </div>
                    )
                  })()
                )}
                {event.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" /> Attendance
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-6">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Prev
        </Button>
        <span className="text-sm text-muted-foreground">Halaman {page}</span>
        <Button
          variant="outline"
          disabled={events.length < limit}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>

      {/* Floating Action Button (FAB) */}
      <Link
        href={`./events/create`}
        className="fixed bottom-20 right-6 md:hidden"
      >
        <Button size="icon" className="rounded-full w-14 h-14 shadow-lg">
          <Plus className="w-6 h-6" />
        </Button>
      </Link>
    </div>
  )
}