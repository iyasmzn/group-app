"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Props = {
  onChange: (value: string) => void
}

const days = [
  { code: "MO", label: "Senin" },
  { code: "TU", label: "Selasa" },
  { code: "WE", label: "Rabu" },
  { code: "TH", label: "Kamis" },
  { code: "FR", label: "Jumat" },
  { code: "SA", label: "Sabtu" },
  { code: "SU", label: "Minggu" },
]

const months = [
  { code: "1", label: "Januari" },
  { code: "2", label: "Februari" },
  { code: "3", label: "Maret" },
  { code: "4", label: "April" },
  { code: "5", label: "Mei" },
  { code: "6", label: "Juni" },
  { code: "7", label: "Juli" },
  { code: "8", label: "Agustus" },
  { code: "9", label: "September" },
  { code: "10", label: "Oktober" },
  { code: "11", label: "November" },
  { code: "12", label: "Desember" },
]

export function RRuleSelector({ onChange }: Props) {
  const [freq, setFreq] = useState<string>("")
  const [interval, setInterval] = useState<number>(1)
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [monthDay, setMonthDay] = useState<number | null>(null)
  const [yearMonth, setYearMonth] = useState<string>("")
  const [yearDay, setYearDay] = useState<number | null>(null)
  const [rrule, setRrule] = useState<string>("")

  const buildRrule = () => {
    if (!freq) return ""
    let rule = `FREQ=${freq};INTERVAL=${interval}`

    if (freq === "WEEKLY" && selectedDays.length > 0) {
      rule += `;BYDAY=${selectedDays.join(",")}`
    }
    if (freq === "MONTHLY" && monthDay) {
      rule += `;BYMONTHDAY=${monthDay}`
    }
    if (freq === "YEARLY" && yearMonth && yearDay) {
      rule += `;BYMONTH=${yearMonth};BYMONTHDAY=${yearDay}`
    }

    return rule
  }

  const updateRrule = () => {
    const rule = buildRrule()
    setRrule(rule)
    onChange(rule)
  }

  const resetRrule = () => {
    setFreq("")
    setInterval(1)
    setSelectedDays([])
    setMonthDay(null)
    setYearMonth("")
    setYearDay(null)
    setRrule("")
    onChange("")
  }

  const humanReadable = () => {
    if (!rrule) return "Tidak berulang"
    const intervalText = interval > 1 ? `setiap ${interval} ` : "setiap "
    if (freq === "DAILY") return `Event berulang ${intervalText}hari`
    if (freq === "WEEKLY") {
      if (selectedDays.length === 0) return `Event berulang ${intervalText}minggu`
      const labels = days
        .filter((d) => selectedDays.includes(d.code))
        .map((d) => d.label)
      return `Event berulang ${intervalText}minggu pada ${labels.join(", ")}`
    }
    if (freq === "MONTHLY") {
      return monthDay
        ? `Event berulang ${intervalText}bulan pada tanggal ${monthDay}`
        : `Event berulang ${intervalText}bulan`
    }
    if (freq === "YEARLY") {
      if (yearMonth && yearDay) {
        const monthLabel = months.find((m) => m.code === yearMonth)?.label
        return `Event berulang ${intervalText}tahun pada ${yearDay} ${monthLabel}`
      }
      return `Event berulang ${intervalText}tahun`
    }
    return rrule
  }

  return (
    <div className="space-y-2">
      <Label>Pengulangan</Label>
      <div className="flex items-center gap-2">
        <Select value={freq} onValueChange={(v) => { setFreq(v); updateRrule() }}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Pilih frekuensi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DAILY">Harian</SelectItem>
            <SelectItem value="WEEKLY">Mingguan</SelectItem>
            <SelectItem value="MONTHLY">Bulanan</SelectItem>
            <SelectItem value="YEARLY">Tahunan</SelectItem>
          </SelectContent>
        </Select>

        {freq && (
          <Input
            type="number"
            min={1}
            value={interval}
            onChange={(e) => {
              setInterval(parseInt(e.target.value) || 1)
              updateRrule()
            }}
            className="w-20"
          />
        )}

        {rrule && (
          <Button type="button" variant="outline" size="sm" onClick={resetRrule}>
            Hapus
          </Button>
        )}
      </div>

      {freq === "WEEKLY" && (
        <div className="grid grid-cols-2 gap-2 mt-2">
          {days.map((d) => (
            <label key={d.code} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={selectedDays.includes(d.code)}
                onCheckedChange={() => {
                  const updated = selectedDays.includes(d.code)
                    ? selectedDays.filter((x) => x !== d.code)
                    : [...selectedDays, d.code]
                  setSelectedDays(updated)
                  updateRrule()
                }}
              />
              {d.label}
            </label>
          ))}
        </div>
      )}

      {freq === "MONTHLY" && (
        <div className="mt-2">
          <Label>Tanggal dalam bulan</Label>
          <Input
            type="number"
            min={1}
            max={31}
            value={monthDay ?? ""}
            onChange={(e) => {
              setMonthDay(parseInt(e.target.value) || null)
              updateRrule()
            }}
            placeholder="contoh: 15"
            className="w-32"
          />
        </div>
      )}

      {freq === "YEARLY" && (
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <Label>Bulan</Label>
            <Select
              value={yearMonth}
              onValueChange={(v) => {
                setYearMonth(v)
                updateRrule()
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih bulan" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m.code} value={m.code}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Tanggal</Label>
            <Input
              type="number"
              min={1}
              max={31}
              value={yearDay ?? ""}
              onChange={(e) => {
                setYearDay(parseInt(e.target.value) || null)
                updateRrule()
              }}
              placeholder="contoh: 25"
            />
          </div>
        </div>
      )}

      <p className="text-sm text-muted-foreground mt-2">{humanReadable()}</p>
    </div>
  )
}