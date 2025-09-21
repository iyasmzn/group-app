import {
  addDays,
  addWeeks,
  addMonths,
  eachDayOfInterval,
  isWithinInterval,
  format,
  differenceInDays,
  differenceInWeeks,
  differenceInMonths,
} from "date-fns"
import { id as localeID } from "date-fns/locale"

/**
 * Format tanggal dengan locale Indonesia
 */
export function formatScheduleDate(date: Date, fmt: string = "dd MMM yyyy") {
  return format(date, fmt, { locale: localeID })
}

/**
 * Generate semua hari dalam range
 */
export function getDaysInRange(start: Date, end: Date): Date[] {
  return eachDayOfInterval({ start, end })
}

/**
 * Tambah hari ke tanggal tertentu
 */
export function addDaysToDate(date: Date, days: number): Date {
  return addDays(date, days)
}

/**
 * Tambah minggu
 */
export function addWeeksToDate(date: Date, weeks: number): Date {
  return addWeeks(date, weeks)
}

/**
 * Tambah bulan
 */
export function addMonthsToDate(date: Date, months: number): Date {
  return addMonths(date, months)
}

/**
 * Cek apakah tanggal ada dalam interval tertentu
 */
export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  return isWithinInterval(date, { start, end })
}

/**
 * Hitung selisih hari/minggu/bulan
 */
export function diffDays(start: Date, end: Date): number {
  return differenceInDays(end, start)
}
export function diffWeeks(start: Date, end: Date): number {
  return differenceInWeeks(end, start)
}
export function diffMonths(start: Date, end: Date): number {
  return differenceInMonths(end, start)
}
