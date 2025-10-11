"use client"

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
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { ReactNode, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export function ExcuseDialog({
  trigger,
  initialNotes,
  onSave,
}: {
  trigger: ReactNode
  initialNotes?: string
  onSave: (notes: string) => void
}) {
  const [notes, setNotes] = useState(initialNotes || "")
  const [preset, setPreset] = useState("")

  const presetOptions = [
    "Bekerja",
    "Sakit",
    "Urusan keluarga",
    "Perjalanan",
  ]

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Alasan Izin</AlertDialogTitle>
          <AlertDialogDescription>
            Pilih alasan izin atau tulis manual.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Default pilihan */}
        <div className="py-2 space-y-2">
          <Select
            value={preset}
            onValueChange={(val) => {
              setPreset(val)
              setNotes(val) // otomatis isi textarea
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih alasan umum" />
            </SelectTrigger>
            <SelectContent>
              {presetOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Textarea untuk detail */}
          <Textarea
            placeholder="Tulis alasan izin..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onSave(notes)
              setNotes("")
              setPreset("")
            }}
          >
            Simpan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}