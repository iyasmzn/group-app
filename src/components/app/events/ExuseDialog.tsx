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

export function ExcuseDialog({
  trigger,
  initialNotes,
  onSave,
}: {
  trigger: ReactNode
  initialNotes?: string | null
  onSave: (notes: string) => void
}) {
  const [notes, setNotes] = useState(initialNotes || "")

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Alasan Izin</AlertDialogTitle>
          <AlertDialogDescription>
            Silakan isi atau ubah alasan izin untuk peserta ini.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-2">
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
              setNotes("") // reset setelah simpan
            }}
          >
            Simpan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}