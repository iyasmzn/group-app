/**
 * Format tanggal ke format lokal
 * default locale = 'id-ID'
 */
// | Properti       | Nilai contoh                                              | Keterangan                                     |
// | -------------- | --------------------------------------------------------- | ---------------------------------------------- |
// | `weekday`      | `"long"`, `"short"`, `"narrow"`                           | Nama hari (`Senin`, `Sen`, `S`)                |
// | `year`         | `"numeric"`, `"2-digit"`                                  | Tahun (`2025` atau `25`)                       |
// | `month`        | `"numeric"`, `"2-digit"`, `"long"`, `"short"`, `"narrow"` | Bulan (`9`, `09`, `September`, `Sep`, `S`)     |
// | `day`          | `"numeric"`, `"2-digit"`                                  | Tanggal (`9` atau `09`)                        |
// | `hour`         | `"numeric"`, `"2-digit"`                                  | Jam (`9` atau `09`)                            |
// | `minute`       | `"numeric"`, `"2-digit"`                                  | Menit                                          |
// | `second`       | `"numeric"`, `"2-digit"`                                  | Detik                                          |
// | `hour12`       | `true` / `false`                                          | Apakah pakai format 12 jam (AM/PM) atau 24 jam |
// | `timeZone`     | `"UTC"`, `"Asia/Jakarta"`, dll.                           | Zona waktu                                     |
// | `timeZoneName` | `"short"`, `"long"`                                       | Nama zona (`GMT+7`, `WIB`)                     |

export function formatDate(
  date: string | Date,
  locale: string | null,
  options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" }
) {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat(locale || "id-ID", options).format(d)
}

export function longDateTime(
  date: string | Date,
  locale?: string | null
) {
  const d = typeof date === "string" ? new Date(date) : date

  return new Intl.DateTimeFormat(locale || "id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(d)
}

export function longDate(
  date: string | Date,
  locale: string = "id-ID"
) {
  const d = typeof date === "string" ? new Date(date) : date

  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d)
}

/**
 * Format angka dengan ribuan (1.000, 10.000, dll)
 */
export function formatNumber(num: number, locale: string = "id-ID") {
  return new Intl.NumberFormat(locale).format(num)
}

/**
 * Format uang (currency)
 * default IDR
 */
export function formatCurrency(
  amount: number,
  currency: string = "IDR",
  locale: string = "id-ID"
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

/**
 * Potong teks dengan ellipsis
 */
export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

/**
 * Capitalize huruf pertama
 */
export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Ambil inisial dari nama (contoh: "Group App" => "GA")
 */
export function getInitials(
  name: string,
  max: number = 2,
  preserveCase: boolean = true
): string {
  if (!name) return "?" // fallback kalau kosong

  const words = name
    .trim()
    .split(" ")
    .filter(Boolean)

  if (words.length === 0) return "?"

  if (words.length === 1) {
    const slice = words[0].slice(0, max)
    return preserveCase ? slice : slice.toUpperCase()
  }

  return words
    .slice(0, max)
    .map(w => {
      const char = w[0] || "?"
      return preserveCase ? char : char.toUpperCase()
    })
    .join("")
}

/**
 * Waktu relatif (contoh: "2 menit lalu", "kemarin", dll.)
 */
export function timeAgo(date: Date | string, locale: string = "id-ID") {
  const d = typeof date === "string" ? new Date(date) : date
  const diff = Date.now() - d.getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return "baru saja"
  if (minutes < 60) return `${minutes} menit lalu`
  if (hours < 24) return `${hours} jam lalu`
  if (days === 1) return "kemarin"
  if (days < 7) return `${days} hari lalu`

  // fallback ke format tanggal
  return formatDate(d, locale)
}

export function formatDateDivider(dateStr: string) {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  const isToday = date.toDateString() === today.toDateString()
  const isYesterday = date.toDateString() === yesterday.toDateString()

  if (isToday) return "Hari ini"
  if (isYesterday) return "Kemarin"
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}
