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
  locale: string | null
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
export function getInitials(name: string, max: number = 2) {
  const words = name.trim().split(" ")
  if (words.length === 1) return words[0][0]?.toUpperCase() || ""
  return words.slice(0, max).map(w => w[0]?.toUpperCase()).join("")
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

