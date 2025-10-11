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
}: {
  trigger: ReactNode
  initialNotes?: string
  onSave: (notes: string) => void
}) {
  const [notes, setNotes] = useState(initialNotes || "")
  const [preset, setPreset] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const presetOptions = [
    "Sakit",
    "Urusan keluarga",
    "Tugas lain",
    "Perjalanan",
    "Lainnya",
  ]

  const isDisabled = notes.trim().length === 0

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