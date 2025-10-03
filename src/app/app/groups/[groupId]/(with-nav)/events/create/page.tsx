"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ClipboardList, FileText, MapPin, Users, Wallet } from "lucide-react"
import Reveal from "@/components/animations/Reveal"
import { useAuth } from "@/lib/supabase/auth"
import { eventService } from "@/services/eventService/eventService"
import { taskService } from "@/services/eventService/taskService"
import { contributionService } from "@/services/eventService/contributionService"
import { minutesService } from "@/services/eventService/minutesService"
import { RRuleSelector } from "@/components/app/events/RRuleSelector"
import { toast } from "sonner"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { DateRange } from "react-day-picker"
import { Switch } from "@/components/ui/switch"
import { attendanceService } from "@/services/eventService/attendanceService"

export default function CreateEventPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { groupId } = useParams() as { groupId: string }

  const [loading, setLoading] = useState(false)
  const [rrule, setRrule] = useState<string>("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [withTime, setWithTime] = useState(false)
  const [startTime, setStartTime] = useState("08:00")
  const [endTime, setEndTime] = useState("17:00")
  const [dateError, setDateError] = useState<string | null>(null)

  // state toggle tambahan
  const [enableTask, setEnableTask] = useState(false)
  const [enableContribution, setEnableContribution] = useState(false)
  const [enableMinutes, setEnableMinutes] = useState(false)

  // peserta awal (manual input nama)
  const [participants, setParticipants] = useState<string[]>([])
  const [newParticipant, setNewParticipant] = useState("")

  const addParticipant = () => {
    if (newParticipant.trim()) {
      setParticipants([...participants, newParticipant.trim()])
      setNewParticipant("")
    }
  }

  const removeParticipant = (idx: number) => {
    setParticipants(participants.filter((_, i) => i !== idx))
  }


  
  const handleSubmit = async (formData: FormData) => {
    setLoading(true)

    try {
      // 1. Buat event utama
      const newEvent = await eventService.create({
        group_id: groupId,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        start_at: formData.get("start_at") as string,
        end_at: formData.get("end_at") as string,
        location: formData.get("location") as string,
        recurrence_rule: formData.get("recurrence_rule") as string,
      })

      // 2. Assign peserta awal (manual input nama)
      if (participants.length > 0) {
        await attendanceService.assignParticipants(
          newEvent.id,
          participants.map((name) => ({ display_name: name }))
        )
      }

      // 3. Opsional: buat task awal
      const firstTask = formData.get("task_title") as string
      if (firstTask) {
        await taskService.assignTask(newEvent.id, {
          title: firstTask,
          description: formData.get("task_description") as string,
          status: "todo",
        })
      }

      // 4. Opsional: kontribusi awal
      const amount = formData.get("contribution_amount") as string
      if (amount) {
        await contributionService.addContribution(
          newEvent.id,
          user?.id!,
          parseFloat(amount),
          formData.get("contribution_note") as string
        )
      }

      // 5. Opsional: notulen awal
      const minutes = formData.get("minutes") as string
      if (minutes) {
        await minutesService.addMinute(newEvent.id, user?.id!, minutes)
      }

      toast.success("Event berhasil dibuat 🎉")
      router.push(`/app/groups/${groupId}/events`)
    } catch (err: any) {
      toast.error(`Gagal membuat event: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Reveal animation="fadeInDown">
        <h1 className="text-2xl font-bold mb-6">Buat Event Baru</h1>
      </Reveal>

      <form action={handleSubmit} className="space-y-6">
        {/* Event utama */}
        <div>
          <Label htmlFor="title" className="block mb-1">Judul</Label>
          <Input id="title" name="title" required placeholder="Judul event" />
        </div>

        <div>
          <Label htmlFor="description" className="block mb-1">Deskripsi</Label>
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
                    dateRange.from.toDateString() +
                      (withTime ? " " + startTime : " 00:00")
                  ).toISOString()
                : ""
            }
          />
          <input
            type="hidden"
            name="end_at"
            value={
              dateRange?.to
                ? new Date(
                    dateRange.to.toDateString() +
                      (withTime ? " " + endTime : " 23:59")
                  ).toISOString()
                : ""
            }
          />
        </div>

        <div>
          <Label htmlFor="location" className="block mb-1">Lokasi</Label>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <Input id="location" name="location" placeholder="Lokasi event" />
          </div>
        </div>

        <div>
          <RRuleSelector onChange={setRrule} />
          <input type="hidden" name="recurrence_rule" value={rrule} />
        </div>

        {/* Peserta awal */}
        <div className="border-t pt-4 space-y-2">
          <h2 className="font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" /> Peserta Awal
          </h2>
          <div className="flex gap-2">
            <Input
              value={newParticipant}
              onChange={(e) => setNewParticipant(e.target.value)}
              placeholder="Nama peserta"
            />
            <Button type="button" onClick={addParticipant}>Tambah</Button>
          </div>
          <ul className="list-disc pl-5 space-y-1">
            {participants.map((p, idx) => (
              <li key={idx} className="flex justify-between items-center">
                {p}
                <Button
                  type="button"
                  size="xs"
                  variant="ghost"
                  onClick={() => removeParticipant(idx)}
                >
                  Hapus
                </Button>
              </li>
            ))}
          </ul>
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
              <Switch id="contribution_switch" checked={enableContribution} onCheckedChange={setEnableContribution} />
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
              <Switch id="minutes_switch" checked={enableMinutes} onCheckedChange={setEnableMinutes} />
            </div>
            {enableMinutes && (
              <Reveal animation="fadeInUp">
                <Textarea
                  id="minutes"
                  name="minutes"
                  placeholder="Isi notulen (opsional)"
                />
              </Reveal>
            )}
          </div>
        </div>



        <Button type="submit" disabled={loading || !!dateError}>
          {loading ? "Menyimpan..." : "Simpan Event"}
        </Button>
      </form>
    </div>
  )
}