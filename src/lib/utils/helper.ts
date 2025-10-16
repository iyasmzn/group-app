export function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  // Fallback polyfill (UUID v4)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 0xf) >> 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Mengecek apakah string hanya berisi emoji (Extended Pictographic) + spasi
 */
export function isOnlyEmojis(text: string): boolean {
  if (!text) return false

  const trimmed = text.trim()
  if (!trimmed) return false

  // Harus ada minimal satu emoji
  const hasEmoji = /\p{Extended_Pictographic}/u.test(trimmed)

  // Tidak boleh ada karakter selain emoji atau spasi
  const hasNonEmoji = /[^\p{Extended_Pictographic}\s]/u.test(trimmed)

  return hasEmoji && !hasNonEmoji
}

/**
 * Menghitung jumlah emoji dalam string
 */
export function getEmojiCount(text: string): number {
  if (!text) return 0

  const matches = text.match(/\p{Extended_Pictographic}/gu)
  return matches ? matches.length : 0
}
