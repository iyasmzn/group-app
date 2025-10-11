"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MemberMultiSelect, MemberOption } from "@/components/app/events/MemberMultiSelect"
import { toast } from "sonner"
import { attendanceService } from "@/services/eventService/attendanceService"

export function AddParticipantDialog({
  eventId,
  members,
  onAdded,
}: {
  eventId: string
  members: MemberOption[]
  onAdded: () => void
}) {
  const [open, setOpen] = useState(false)
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [manualName, setManualName] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    try {
      setLoading(true)

      // siapkan payload batch
      const payload = [
        ...selectedMembers.map((user_id) => ({
          user_id,
          status: null, // default status
        })),
        ...(manualName.trim()
          ? [{ display_name: manualName.trim(), status: null }]
          : []),
      ]

      if (payload.length === 0) {
        toast.error("Tidak ada peserta yang dipilih/ditulis")
        return
      }

      await attendanceService.assignParticipants(eventId, payload)

      toast.success("Peserta berhasil ditambahkan")
      setSelectedMembers([])
      setManualName("")
      setOpen(false)
      onAdded()
    } catch (err) {
      toast.error("Gagal menambah peserta")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1" /> Tambah Peserta
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Peserta</DialogTitle>
        </DialogHeader>

        {/* Pilih dari member grup */}
        <MemberMultiSelect
          members={members}
          selected={selectedMembers}
          onChange={setSelectedMembers}
        />

        {/* Atau input manual */}
        <div className="mt-4">
          <Input
            placeholder="Nama peserta manual..."
            value={manualName}
            onChange={(e) => setManualName(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button onClick={handleSave} disabled={loading}>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}