"use client"

import { useEffect, useState } from "react"
import Reveal from "@/components/animations/Reveal"
import { Users } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { attendanceService, GroupEventAttendance } from "@/services/eventService/attendanceService"

export default function PesertaTab({ eventId }: { eventId: string }) {
  const [attendees, setAttendees] = useState<GroupEventAttendance[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAttendees = async () => {
    try {
      const data = await attendanceService.read({ event_id: eventId })
      setAttendees(data)
    } catch (err) {
      console.error("Error fetching attendees:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendees()
  }, [eventId])

  const handleMark = async (userId: string, status: GroupEventAttendance["status"]) => {
    try {
      await attendanceService.markAttendance(eventId, userId, status)
      fetchAttendees()
    } catch (err) {
      console.error("Error marking attendance:", err)
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

  return (
    <div className="space-y-3">
      {attendees.map((a) => (
        <Reveal key={`${a.event_id}-${a.user_id}`} animation="fadeInUp">
          <div className="flex items-center justify-between text-sm text-neutral-700 dark:text-neutral-300 border-b pb-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>User {a.user_id}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">
                {a.status}
              </span>
            </div>
            <div className="flex gap-2">
              {(["present", "absent", "late", "excused"] as const).map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={a.status === s ? "default" : "outline"}
                  onClick={() => handleMark(a.user_id, s)}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  )
}