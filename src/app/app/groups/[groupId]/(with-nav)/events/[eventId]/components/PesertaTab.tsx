"use client"

import { useCallback, useEffect, useState } from "react"
import Reveal from "@/components/animations/Reveal"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { attendanceService, GroupEventAttendance } from "@/services/eventService/attendanceService"
import { GroupAvatar } from "@/components/group-avatar"
import { toast } from "sonner"
import { longDateTime } from "@/lib/utils/format"
import LoadingOverlay from "@/components/loading-overlay"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PesertaTab({ eventId }: { eventId: string }) {
  const [attendees, setAttendees] = useState<GroupEventAttendance[]>([])
  const [loading, setLoading] = useState(true)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [filter, setFilter] = useState<"all" | GroupEventAttendance["status"]>("all")

  const fetchAttendees = useCallback(async () => {
    try {
      const data = await attendanceService.read({ event_id: eventId }, {
        select: "*, profiles(full_name, avatar_url)"
      })
      setAttendees(data)
    } catch (err) {
      console.error("Error fetching attendees:", err)
    } finally {
      setLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    fetchAttendees()
  }, [fetchAttendees])

  const handleMark = async (id: string, status: GroupEventAttendance["status"]) => {
    try {
      setUpdateLoading(true)
      await attendanceService.markAttendance(id, status).then(() => {
        toast.success("Update success")
      })
      fetchAttendees()
    } catch (err) {
      toast.error("Update Failed")
      console.log(err)
    } finally {
      setUpdateLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-1/2" />
        ))}
      </div>
    )
  }

  if (attendees.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Belum ada peserta yang terdaftar.
      </p>
    )
  }

  // mapping warna status
  const statusColor: Record<GroupEventAttendance["status"], string> = {
    present: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    absent: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    late: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    excused: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  }

  // mapping label status
  const statusLabel: Record<GroupEventAttendance["status"], string> = {
    present: "Hadir",
    absent: "Tidak Hadir",
    late: "Terlambat",
    excused: "Izin",
  }

  // urutan sort status
  const statusOrder: GroupEventAttendance["status"][] = [
    "present",
    "late",
    "excused",
    "absent",
  ]

  // filter + sort
  const filteredAttendees = attendees.filter((a) =>
    filter === "all" ? true : a.status === filter
  )
  const sortedAttendees = [...filteredAttendees].sort(
    (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
  )

  const counts = attendees.reduce(
    (acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1
      acc.all += 1
      return acc
    },
    { all: 0, present: 0, absent: 0, late: 0, excused: 0 } as Record<
      "all" | GroupEventAttendance["status"],
      number
    >
  )
  
  return (
    <div className="space-y-3">
      <LoadingOverlay isLoading={updateLoading} />

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">
          Total Peserta: {counts.all}
        </p>
        {/* Filter Dropdown */}
        <Select value={filter} onValueChange={(v: "all" | GroupEventAttendance["status"]) => setFilter(v)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua ({counts.all})</SelectItem>
            <SelectItem value="present">Hadir ({counts.present})</SelectItem>
            <SelectItem value="late">Terlambat ({counts.late})</SelectItem>
            <SelectItem value="excused">Izin ({counts.excused})</SelectItem>
            <SelectItem value="absent">Tidak Hadir ({counts.absent})</SelectItem>
          </SelectContent>
        </Select>
      </div>



      {sortedAttendees.map((a) => {
        const name = a.display_name
          ? a.display_name
          : a.profiles?.full_name || `User ${a.user_id}`
        return (
          <Reveal key={`${a.event_id}-${a.id}`} animation="fadeInUp">
            <div className="flex items-center justify-between text-sm text-neutral-700 dark:text-neutral-300 border-b pb-2">
              <div className="flex items-center gap-2">
                <GroupAvatar image={a.profiles?.avatar_url} name={name} />
                <span>{name}</span>
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded",
                    statusColor[a.status]
                  )}
                >
                  {statusLabel[a.status]}
                </span>
                {a.attend_at && (
                  <span className="text-xs text-muted-foreground">
                    • {longDateTime(a.attend_at)}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                {(["present", "absent", "late", "excused"] as const).map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={a.status === s ? "default" : "outline"}
                    onClick={() => handleMark(a.id, s)}
                  >
                    {statusLabel[s]}
                  </Button>
                ))}
              </div>
            </div>
          </Reveal>
        )
      })}
    </div>
  )
}