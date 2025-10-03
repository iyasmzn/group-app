"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"

export function RRuleInfoDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 text-sm text-muted-foreground"
        >
          <Info className="w-4 h-4" />
          Apa itu RRULE?
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Recurrence Rule (RRULE)</DialogTitle>
          <DialogDescription>
            RRULE adalah format standar (iCalendar RFC 5545) untuk mendefinisikan
            pola pengulangan event. Dengan RRULE, kamu bisa membuat event
            berulang otomatis tanpa harus input manual satu per satu.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <p>
            Contoh penggunaan umum:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <code>FREQ=DAILY</code> → event berulang setiap hari
            </li>
            <li>
              <code>FREQ=WEEKLY;BYDAY=MO,WE,FR</code> → event setiap Senin, Rabu, Jumat
            </li>
            <li>
              <code>FREQ=MONTHLY;BYMONTHDAY=15</code> → event tiap tanggal 15
            </li>
            <li>
              <code>FREQ=YEARLY;BYMONTH=12;BYDAY=25</code> → event tahunan (25 Desember)
            </li>
          </ul>

          <p>
            Kamu bisa kombinasikan aturan ini untuk membuat pola kompleks, misalnya
            “setiap 2 minggu sekali di hari Selasa” dengan:
            <br />
            <code>FREQ=WEEKLY;INTERVAL=2;BYDAY=TU</code>
          </p>

          <p className="text-muted-foreground">
            Jika tidak diisi, event dianggap hanya sekali (non‑recurring).
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}