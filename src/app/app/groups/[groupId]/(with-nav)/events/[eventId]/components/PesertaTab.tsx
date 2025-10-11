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
import { Input } from "@/components/ui/input"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Pencil } from "lucide-react"

export default function PesertaTab({ eventId }: { eventId: string }) {
  const [attendees, setAttendees] = useState<GroupEventAttendance[]>([])
  const [loading, setLoading] = useState(true)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [filter, setFilter] = useState<"all" | GroupEventAttendance["status"]>("all")
  const [search, setSearch] = useState("")
  const [excuseNotes, setExcuseNotes] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)


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

  const handleMark = async (
    id: string,
    status: GroupEventAttendance["status"],
    notes?: string | null
  ) => {
    try {
      setUpdateLoading(true)
      await attendanceService.markAttendance(id, status, notes)
      toast.success("Update success")
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

  // mapping warna status (badge ringkas)
  const statusColor: Record<GroupEventAttendance["status"], string> = {
    present: "bg-green-500",
    absent: "bg-red-500",
    late: "bg-yellow-500",
    excused: "bg-blue-500",
  }

  const statusLabel: Record<GroupEventAttendance["status"], string> = {
    present: "Hadir",
    absent: "Tidak Hadir",
    late: "Terlambat",
    excused: "Izin",
  }

  const statusOrder: GroupEventAttendance["status"][] = [
    "present",
    "late",
    "excused",
    "absent",
  ]

  // filter + search + sort
  const filteredAttendees = attendees
    .filter((a) => (filter === "all" ? true : a.status === filter))
    .filter((a) => {
      const name = a.display_name || a.profiles?.full_name || `User ${a.user_id}`
      return name.toLowerCase().includes(search.toLowerCase())
    })

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

      {/* Header: total + filter + search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="text-sm font-medium">
          Total Peserta: {counts.all}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Cari peserta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-[200px]"
          />
          <Select
            value={filter}
            onValueChange={(v: "all" | GroupEventAttendance["status"]) => setFilter(v)}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
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
      </div>

      {sortedAttendees.map((a) => {
        const name = a.display_name || a.profiles?.full_name || `User ${a.user_id}`
        return (
          <Reveal key={`${a.event_id}-${a.id}`} animation="fadeInUp">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-neutral-700 dark:text-neutral-300 border-b pb-2">
              {/* Info peserta */}
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <GroupAvatar image={a.profiles?.avatar_url} name={name} size="sm" />
                  <span className="truncate">{name}</span>
                  {/* Badge ringkas */}
                  <span className="flex items-center gap-1 text-xs">
                    <span
                      className={cn(
                        "inline-block w-2 h-2 rounded-full",
                        statusColor[a.status]
                      )}
                    />
                    {statusLabel[a.status]}
                  </span>
                  {a.attend_at && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      • {longDateTime(a.attend_at)}
                    </span>
                  )}
                </div>

                {/* 👇 Notes tampil di bawah jika ada */}
                {a.status === "excused" && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground ml-8">
                    {a.notes ? (
                      <>
                        <span>Alasan: {a.notes}</span>
                        {/* Tombol edit */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              className="text-primary hover:underline flex items-center gap-1"
                              onClick={() => {
                                setEditingId(a.id)
                                setExcuseNotes(a.notes || "")
                              }}
                            >
                              <Pencil className="w-3 h-3" /> Edit
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Edit Alasan Izin</AlertDialogTitle>
                              <AlertDialogDescription>
                                Ubah alasan izin untuk peserta ini.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="py-2">
                              <Textarea
                                placeholder="Tulis alasan izin..."
                                value={excuseNotes}
                                onChange={(e) => setExcuseNotes(e.target.value)}
                              />
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setEditingId(null)}>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  if (editingId) {
                                    handleMark(editingId, "excused", excuseNotes)
                                  }
                                  setExcuseNotes("")
                                  setEditingId(null)
                                }}
                              >
                                Simpan
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </>
                    ) : (
                      <span className="italic">Belum ada alasan</span>
                    )}
                  </div>
                )}
              </div>

              {/* Tombol aksi */}
              <div className="flex flex-wrap sm:flex-nowrap gap-2">
                {(["present", "absent", "late"] as const).map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={a.status === s ? "default" : "outline"}
                    onClick={() => handleMark(a.id, s, null)}
                    className="flex-1 sm:flex-none"
                  >
                    {statusLabel[s]}
                  </Button>
                ))}

                {/* Tombol izin pakai dialog */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant={a.status === "excused" ? "default" : "outline"}
                      className="flex-1 sm:flex-none"
                      onClick={() => {
                        setEditingId(a.id)
                        setExcuseNotes(a.notes || "")
                      }}
                    >
                      {statusLabel["excused"]}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Alasan Izin</AlertDialogTitle>
                      <AlertDialogDescription>
                        Silakan isi alasan izin untuk peserta ini.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-2">
                      <Textarea
                        placeholder="Tulis alasan izin..."
                        value={excuseNotes}
                        onChange={(e) => setExcuseNotes(e.target.value)}
                      />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          handleMark(a.id, "excused", excuseNotes)
                          setExcuseNotes("")
                        }}
                      >
                        Simpan
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </Reveal>
        )
      })}
    </div>
  )
}