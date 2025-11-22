'use client'

import { useCallback, useEffect, useState } from 'react'
import Reveal from '@/components/animations/Reveal'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { attendanceService, GroupEventAttendance } from '@/services/eventService/attendanceService'
import { toast } from 'sonner'
import { longDateTime } from '@/lib/utils/format'
import LoadingOverlay from '@/components/loading-overlay'
import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Pencil, Trash2 } from 'lucide-react'
import { ExcuseDialog } from '@/components/app/events/ExuseDialog'
import { AddParticipantDialog } from '@/components/app/events/AddParticipantDialog'
import { useGroupMembers } from '@/lib/hooks/useGroupMembers'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { AppAvatar } from '@/components/ui/app-avatar'
import { useAuth } from '@/context/AuthContext'

export default function PesertaTab({
  eventId,
  groupId,
  roleCode,
}: {
  eventId: string
  groupId: string
  roleCode: string
}) {
  const { user } = useAuth()
  const [attendees, setAttendees] = useState<GroupEventAttendance[]>([])
  const [loading, setLoading] = useState(true)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | GroupEventAttendance['status']>('all')
  const [search, setSearch] = useState('')
  const { members: groupMembers, loading: membersLoading } = useGroupMembers(groupId)
  // ambil semua user_id peserta yang sudah terdaftar
  const existingIds = new Set(attendees.map((a) => a.user_id).filter(Boolean))
  // filter members agar hanya yang belum jadi peserta
  const availableMembers = groupMembers.filter((m) => !existingIds.has(m.user_id))

  const fetchAttendees = useCallback(async () => {
    try {
      const data = await attendanceService.read(
        { event_id: eventId },
        {
          select: '*, profiles(full_name, avatar_url)',
        }
      )
      setAttendees(data)
    } catch (err) {
      console.error('Error fetching attendees:', err)
    } finally {
      setLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    fetchAttendees()
  }, [fetchAttendees])

  const handleMark = async (
    id: string,
    status: GroupEventAttendance['status'],
    notes?: string | null
  ) => {
    try {
      setUpdateLoading(true)
      await attendanceService.markAttendance(id, status, notes)
      toast.success('Update success')
      fetchAttendees()
    } catch (err) {
      toast.error('Update Failed')
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
    return <p className="text-sm text-muted-foreground">Belum ada peserta yang terdaftar.</p>
  }

  // mapping warna status (badge ringkas)
  const statusColor: Record<GroupEventAttendance['status'], string> = {
    present: 'bg-green-500',
    absent: 'bg-red-500',
    late: 'bg-yellow-500',
    excused: 'bg-blue-500',
  }

  const statusLabel: Record<GroupEventAttendance['status'], string> = {
    present: 'Hadir',
    absent: 'Tidak Hadir',
    late: 'Terlambat',
    excused: 'Izin',
  }

  const statusOrder: GroupEventAttendance['status'][] = ['present', 'late', 'excused', 'absent']

  // filter + search + sort
  const filteredAttendees = attendees
    .filter((a) => (filter === 'all' ? true : a.status === filter))
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
      'all' | GroupEventAttendance['status'],
      number
    >
  )

  return (
    <div className="space-y-3">
      <LoadingOverlay isLoading={updateLoading} />

      {/* Header: total + filter + search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex justify-between items-end gap-2">
          <p className="text-sm font-medium">Total Peserta: {counts.all}</p>
          {!membersLoading && roleCode === 'admin' && (
            <AddParticipantDialog
              eventId={eventId}
              members={availableMembers.map((m) => ({
                user_id: m.user_id,
                full_name: m.profiles?.full_name ?? null,
                profiles: m.profiles,
              }))}
              onAdded={fetchAttendees}
              existingNames={attendees.map((a) => a.display_name || a.profiles?.full_name || '')}
            />
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Cari peserta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-[200px]"
          />
          <Select
            value={filter}
            onValueChange={(v: 'all' | GroupEventAttendance['status']) => setFilter(v)}
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
                  <AppAvatar image={a.profiles?.avatar_url} name={name} size="sm" />
                  <span className="truncate">{name}</span>
                  {/* Badge ringkas */}
                  <span className="flex items-center gap-1 text-xs">
                    <span
                      className={cn('inline-block w-2 h-2 rounded-full', statusColor[a.status])}
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
                {a.status === 'excused' && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground ml-8">
                    {a.notes ? (
                      <>
                        <span>Alasan: {a.notes}</span>
                        <ExcuseDialog
                          roleCode={roleCode}
                          canEdit={a.user_id === user?.id}
                          initialNotes={a.notes}
                          onSave={(notes) => handleMark(a.id, 'excused', notes)}
                          trigger={
                            <button className="text-primary hover:underline flex items-center gap-1">
                              <Pencil className="w-3 h-3" /> Edit
                            </button>
                          }
                        />
                      </>
                    ) : (
                      <span className="italic">Belum ada alasan</span>
                    )}
                  </div>
                )}
              </div>

              {/* Tombol aksi */}
              <div className="flex flex-wrap sm:flex-nowrap gap-2">
                {roleCode === 'admin' ? (
                  // Admin bisa semua
                  <>
                    {(['present', 'absent', 'late'] as const).map((s) => (
                      <Button
                        key={s}
                        size="sm"
                        variant={a.status === s ? 'default' : 'outline'}
                        onClick={() => handleMark(a.id, s, null)}
                        className="flex-1 sm:flex-none"
                      >
                        {statusLabel[s]}
                      </Button>
                    ))}

                    <ExcuseDialog
                      roleCode={roleCode}
                      canEdit={a.user_id === user?.id} // hanya dirinya sendiri
                      initialNotes={a.notes}
                      onSave={(notes) => handleMark(a.id, 'excused', notes)}
                      trigger={
                        <Button
                          size="sm"
                          variant={a.status === 'excused' ? 'default' : 'outline'}
                          className="flex-1 sm:flex-none"
                        >
                          {statusLabel['excused']}
                        </Button>
                      }
                    />

                    {/* Hapus peserta */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive" className="flex-1 sm:flex-none">
                          <Trash2 className="w-4 h-4 mr-1" /> Hapus
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Peserta</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah kamu yakin ingin menghapus <b>{name}</b> dari daftar peserta?
                            Tindakan ini tidak bisa dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              try {
                                setUpdateLoading(true)
                                await attendanceService.remove(a.id)
                                toast.success('Peserta dihapus')
                                fetchAttendees()
                              } catch (err) {
                                toast.error('Gagal menghapus peserta')
                                console.error(err)
                              } finally {
                                setUpdateLoading(false)
                              }
                            }}
                          >
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                ) : (
                  // Non-admin hanya bisa izin
                  <>
                    {a.user_id === user?.id && (
                      <ExcuseDialog
                        roleCode={roleCode}
                        canEdit={a.user_id === user?.id}
                        initialNotes={a.notes}
                        onSave={(notes) => handleMark(a.id, 'excused', notes)}
                        trigger={
                          <Button
                            size="sm"
                            variant={a.status === 'excused' ? 'default' : 'outline'}
                            className="flex-1 sm:flex-none"
                          >
                            {statusLabel['excused']}
                          </Button>
                        }
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          </Reveal>
        )
      })}
    </div>
  )
}
