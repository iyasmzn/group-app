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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ReactNode, useRef, useState } from "react"

export function ExcuseDialog({
  trigger,
  initialNotes,
  onSave,
  roleCode,
  canEdit,
}: {
  trigger: ReactNode
  initialNotes?: string | null
  onSave: (notes: string) => void
  roleCode: string
  canEdit: boolean
}) {
  const [notes, setNotes] = useState(initialNotes || "")
  const [preset, setPreset] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const presetOptions = [
    "Bekerja",
    "Sakit",
    "Urusan keluarga",
    "Tugas lain",
    "Perjalanan",
    "Lainnya",
  ]

  const isDisabled = notes.trim().length === 0

  // 🚫 Jika bukan admin dan bukan dirinya sendiri → disable trigger
  if (roleCode !== "admin" && !canEdit) {
    return <>{trigger}</> // tampilkan tombol tapi tidak bisa buka dialog
  }

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

        <div className="py-2 space-y-2">
          <Select
            value={preset}
            onValueChange={(val) => {
              setPreset(val)
              if (val === "Lainnya") {
                setNotes("")
                setTimeout(() => textareaRef.current?.focus(), 50)
              } else {
                setNotes(val)
              }
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

          <Textarea
            ref={textareaRef}
            placeholder="Tulis alasan izin..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            disabled={isDisabled}
            onClick={() => {
              if (!isDisabled) {
                onSave(notes)
                setNotes("")
                setPreset("")
              }
            }}
          >
            Simpan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}