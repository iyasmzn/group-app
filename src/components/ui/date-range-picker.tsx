"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { DateRange } from "react-day-picker"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import clsx from "clsx"
import { toast } from "sonner"
import { TimePicker24 } from "./time-picker-24"

type Props = {
  value?: DateRange
  onChange: (range: DateRange | undefined) => void
  withTime?: boolean
  onToggleTime?: (enabled: boolean) => void
  startTime?: string
  endTime?: string
  onStartTimeChange?: (val: string) => void
  onEndTimeChange?: (val: string) => void
  onError?: (err: string | null) => void
}

export function DateRangePicker({
  value,
  onChange,
  withTime = false,
  onToggleTime,
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  onError,
}: Props) {
  const [open, setOpen] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!value?.from || !value?.to) {
      setError(null)
      onError?.(null)
      return
    }

    const startDate = new Date(value.from)
    const endDate = new Date(value.to)

    if (withTime && startTime && endTime) {
      const [sh, sm] = startTime.split(":").map(Number)
      const [eh, em] = endTime.split(":").map(Number)
      startDate.setHours(sh, sm)
      endDate.setHours(eh, em)
    }

    if (endDate < startDate) {
      if (
        withTime &&
        startTime &&
        endTime &&
        value.from?.toDateString() === value.to?.toDateString()
      ) {
        // Jika hari sama tapi jam salah → swap jam
        onStartTimeChange?.(endTime)
        onEndTimeChange?.(startTime)
        toast.info("Jam otomatis disesuaikan ⏱️")
        setError(null)
        onError?.(null)
      } else {
        // Jika tanggal akhir < tanggal awal → swap tanggal
        onChange({ from: value.to, to: value.from })
        toast.info("Tanggal otomatis disesuaikan 📅")
        setError(null)
        onError?.(null)
      }
    } else {
      setError(null)
      onError?.(null)
    }

  }, [value, withTime, startTime, endTime])

  return (
    <div className="space-y-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "dd MMM yyyy", { locale: id })} -{" "}
                  {format(value.to, "dd MMM yyyy", { locale: id })}
                </>
              ) : (
                format(value.from, "dd MMM yyyy", { locale: id })
              )
            ) : (
              <span>Pilih rentang tanggal</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {/* Toggle jam */}
      <div className="flex items-center gap-2">
        <Switch
          checked={withTime}
          onCheckedChange={(val) => onToggleTime?.(!!val)}
          id="with-time"
        />
        <Label htmlFor="with-time" className="flex items-center gap-1">
          <Clock className="w-4 h-4" /> Tambahkan jam
        </Label>
      </div>

      {withTime && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="block mb-1">Jam Mulai</Label>
            <TimePicker24
              value={startTime}
              onChange={(val) => onStartTimeChange?.(val)}
            />
          </div>
          <div>
            <Label className="block mb-1">Jam Selesai</Label>
            <TimePicker24
              value={endTime}
              onChange={(val) => onEndTimeChange?.(val)}
            />
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}