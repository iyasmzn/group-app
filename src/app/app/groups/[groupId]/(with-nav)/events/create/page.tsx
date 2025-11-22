'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams, redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ClipboardList, FileText, MapPin, User, Users, Wallet } from 'lucide-react'
import Reveal from '@/components/animations/Reveal'
import { eventService } from '@/services/eventService/eventService'
import { taskService } from '@/services/eventService/taskService'
import { contributionService } from '@/services/eventService/contributionService'
import { minutesService } from '@/services/eventService/minutesService'
import { RRuleSelector } from '@/components/app/events/RRuleSelector'
import { toast } from 'sonner'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { DateRange } from 'react-day-picker'
import { Switch } from '@/components/ui/switch'
import { attendanceService } from '@/services/eventService/attendanceService'
import { groupMemberService } from '@/services/eventService/groupMemberService'
import { MemberMultiSelect, MemberOption } from '@/components/app/events/MemberMultiSelect'
import LoadingOverlay from '@/components/loading-overlay'
import { useAuth } from '@/context/AuthContext'

export default function CreateEventPage() {
  const { user } = useAuth()

  const router = useRouter()
  const { groupId } = useParams() as { groupId: string }

  const [loading, setLoading] = useState(false)
  const [rrule, setRrule] = useState<string>('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [withTime, setWithTime] = useState(false)
  const [startTime, setStartTime] = useState('08:00')
  const [endTime, setEndTime] = useState('17:00')
  const [dateError, setDateError] = useState<string | null>(null)

  // state toggle tambahan
  const [enableTask, setEnableTask] = useState(false)
  const [enableContribution, setEnableContribution] = useState(false)
  const [enableMinutes, setEnableMinutes] = useState(false)

  // peserta awal (manual input nama)
  const [participants, setParticipants] = useState<string[]>([])
  const [newParticipant, setNewParticipant] = useState('')

  // state untuk assign semua member
  const [assignAll, setAssignAll] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [groupMembers, setGroupMembers] = useState<MemberOption[]>([])
  const [participantError, setParticipantError] = useState<string | null>(null)
  const [participantInputError, setParticipantInputError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return redirect('/login')

    const fetchMembers = async () => {
      const data = await groupMemberService.read(
        { group_id: groupId },
        {
          select: '*, profiles(*)',
        }
      )
      setGroupMembers(
        data.map((m) => ({
          user_id: m.user_id,
          full_name: m?.profiles?.full_name ?? '(Tanpa Nama)',
          profiles: m?.profiles,
        }))
      )
      // TODO: ganti `m.user_id` dengan field nama user kalau ada relasi ke profile
    }
    fetchMembers()
  }, [groupId])

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)

    // Validasi peserta
    if (!assignAll && selectedMembers.length === 0 && participants.length === 0) {
      setParticipantError('Minimal harus ada 1 peserta yang di-assign')
      setLoading(false)
      return
    }

    try {
      // 1. Buat event utama
      const newEvent = await eventService.create({
        group_id: groupId,
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        start_at: formData.get('start_at') as string,
        end_at: formData.get('end_at') as string,
        location: formData.get('location') as string,
        recurrence_rule: formData.get('recurrence_rule') as string,
      })

      // Assign peserta awal
      if (assignAll) {
        const members = await groupMemberService.read({ group_id: groupId })
        await attendanceService.assignParticipants(
          newEvent.id,
          members.map((m) => ({ user_id: m.user_id }))
        )
      } else if (selectedMembers.length > 0) {
        await attendanceService.assignParticipants(
          newEvent.id,
          selectedMembers.map((id) => ({ user_id: id }))
        )
      }
      if (participants.length > 0) {
        await attendanceService.assignParticipants(
          newEvent.id,
          participants.map((name) => ({ display_name: name }))
        )
      }

      // 3. Opsional: buat task awal
      const firstTask = formData.get('task_title') as string
      if (firstTask) {
        await taskService.assignTask(newEvent.id, {
          title: firstTask,
          description: formData.get('task_description') as string,
          status: 'todo',
        })
      }

      // 4. Opsional: kontribusi awal
      const amount = formData.get('contribution_amount') as string
      if (amount && user) {
        await contributionService.addContribution(
          newEvent.id,
          user.id,
          parseFloat(amount),
          formData.get('contribution_note') as string
        )
      }

      // 5. Opsional: notulen awal
      const minutes = formData.get('minutes') as string
      if (minutes && user) {
        await minutesService.addMinute(newEvent.id, user.id, minutes)
      }

      toast.success('Event berhasil dibuat 🎉')
      router.push(`/app/groups/${groupId}/events`)
    } catch (err) {
      toast.error(`Gagal membuat event`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <LoadingOverlay isLoading={loading} />
      <Reveal animation="fadeInDown">
        <h1 className="text-2xl font-bold mb-6">Buat Event Baru</h1>
      </Reveal>

      <form action={handleSubmit} className="space-y-6">
        {/* Event utama */}
        <div>
          <Label htmlFor="title" className="block mb-1">
            Judul
          </Label>
          <Input id="title" name="title" required placeholder="Judul event" />
        </div>

        <div>
          <Label htmlFor="description" className="block mb-1">
            Deskripsi
          </Label>
          <Textarea id="description" name="description" placeholder="Deskripsi event" />
        </div>

        <div>
          <Label className="block mb-1">Tanggal Event</Label>
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            withTime={withTime}
            onToggleTime={setWithTime}
            startTime={startTime}
            endTime={endTime}
            onStartTimeChange={setStartTime}
            onEndTimeChange={setEndTime}
            onError={setDateError}
          />
          {/* hidden input agar tetap masuk ke FormData */}
          <input
            type="hidden"
            name="start_at"
            value={
              dateRange?.from
                ? new Date(
                    dateRange.from.toDateString() + (withTime ? ' ' + startTime : ' 00:00')
                  ).toISOString()
                : ''
            }
          />
          <input
            type="hidden"
            name="end_at"
            value={
              dateRange?.to
                ? new Date(
                    dateRange.to.toDateString() + (withTime ? ' ' + endTime : ' 23:59')
                  ).toISOString()
                : ''
            }
          />
        </div>

        <div>
          <Label htmlFor="location" className="block mb-1">
            Lokasi
          </Label>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <Input id="location" name="location" placeholder="Lokasi event" />
          </div>
        </div>

        <div>
          <RRuleSelector onChange={setRrule} />
          <input type="hidden" name="recurrence_rule" value={rrule} />
        </div>

        <div className="border-t pt-4 space-y-2">
          <h2 className="font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" /> Peserta Awal
          </h2>

          {/* Checkbox assign semua member */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="assign_all"
              checked={assignAll}
              onChange={(e) => setAssignAll(e.target.checked)}
            />
            <Label htmlFor="assign_all">Assign semua member grup</Label>
          </div>

          {/* Multi-select subset */}
          {!assignAll && (
            <div className="space-y-2">
              <Label>Pilih member grup</Label>
              <MemberMultiSelect
                members={groupMembers}
                selected={selectedMembers}
                onChange={setSelectedMembers}
              />
            </div>
          )}

          {/* Input manual nama */}
          {!assignAll && (
            <div className="space-y-2">
              <Label>Tambah peserta manual</Label>
              <div className="flex gap-2">
                <Input
                  value={newParticipant}
                  onChange={(e) => {
                    setNewParticipant(e.target.value)
                    setParticipantInputError(null) // reset error saat user mengetik lagi
                  }}
                  placeholder="Nama peserta"
                  className={
                    participantInputError ? 'border-red-500 focus-visible:ring-red-500' : ''
                  }
                />
                <Button
                  type="button"
                  onClick={() => {
                    const name = newParticipant.trim()
                    if (!name) return

                    // cek duplikat manual
                    const existsManual = participants.some(
                      (p) => p.toLowerCase() === name.toLowerCase()
                    )

                    // cek duplikat dengan member multi-select
                    const existsMember = groupMembers.some(
                      (m) => m.full_name && m.full_name.toLowerCase() === name.toLowerCase()
                    )

                    if (existsManual) {
                      setParticipantInputError('Nama peserta sudah ada di daftar peserta manual')
                      return
                    }

                    if (existsMember) {
                      setParticipantInputError('Nama peserta ada dalam member grup')
                      return
                    }

                    setParticipants([...participants, name])
                    setNewParticipant('')
                    setParticipantInputError(null)
                  }}
                >
                  Tambah
                </Button>
              </div>
              {participantInputError && (
                <p className="text-sm text-red-500">{participantInputError}</p>
              )}
              <ul className="list-disc pl-5 space-y-1">
                {participants.map((p, idx) => (
                  <li key={idx} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {p}
                    </div>
                    <Button
                      type="button"
                      size="xs"
                      variant="ghost"
                      onClick={() => setParticipants(participants.filter((_, i) => i !== idx))}
                    >
                      Hapus
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {participantError && <p className="text-sm text-red-500">{participantError}</p>}
        </div>

        {/* Relasi opsional */}
        <div className="border-t pt-4 space-y-6">
          <h2 className="font-semibold">Tambahan</h2>

          {/* Task awal */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="task_switch" className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-muted-foreground" />
                Task Awal
              </Label>
              <Switch id="task_switch" checked={enableTask} onCheckedChange={setEnableTask} />
            </div>
            {enableTask && (
              <Reveal animation="fadeInUp">
                <div className="space-y-2">
                  <Input id="task_title" name="task_title" placeholder="Judul task" />
                  <Textarea
                    id="task_description"
                    name="task_description"
                    placeholder="Deskripsi task"
                  />
                </div>
              </Reveal>
            )}
          </div>

          {/* Kontribusi awal */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="contribution_switch" className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-muted-foreground" />
                Kontribusi Awal
              </Label>
              <Switch
                id="contribution_switch"
                checked={enableContribution}
                onCheckedChange={setEnableContribution}
              />
            </div>
            {enableContribution && (
              <Reveal animation="fadeInUp">
                <div className="space-y-2">
                  <Input
                    id="contribution_amount"
                    name="contribution_amount"
                    type="number"
                    step="0.01"
                    placeholder="Jumlah (Rp)"
                  />
                  <Input
                    id="contribution_note"
                    name="contribution_note"
                    placeholder="Catatan kontribusi"
                  />
                </div>
              </Reveal>
            )}
          </div>

          {/* Notulen awal */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="minutes_switch" className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                Notulen Awal
              </Label>
              <Switch
                id="minutes_switch"
                checked={enableMinutes}
                onCheckedChange={setEnableMinutes}
              />
            </div>
            {enableMinutes && (
              <Reveal animation="fadeInUp">
                <Textarea id="minutes" name="minutes" placeholder="Isi notulen (opsional)" />
              </Reveal>
            )}
          </div>
        </div>

        <Button type="submit" disabled={loading || !!dateError}>
          {loading ? 'Menyimpan...' : 'Simpan Event'}
        </Button>
      </form>
    </div>
  )
}
