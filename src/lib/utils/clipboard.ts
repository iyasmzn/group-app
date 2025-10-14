/**
 * Clipboard utility functions
 * Works in browsers that support the Clipboard API.
 * Always wrap calls in try/catch if you want to handle errors gracefully.
 */

/**
 * Copy text to clipboard
 * @param text string yang akan dicopy
 * @returns true jika berhasil, false jika gagal
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (!navigator?.clipboard) {
    console.warn("Clipboard API not supported in this browser")
    return false
  }
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error("Failed to copy: ", err)
    return false
  }
}

/**
 * Read text from clipboard
 * @returns string hasil baca clipboard, atau null jika gagal
 */
export async function readFromClipboard(): Promise<string | null> {
  if (!navigator?.clipboard) {
    console.warn("Clipboard API not supported in this browser")
    return null
  }
  try {
    const text = await navigator.clipboard.readText()
    return text
  } catch (err) {
    console.error("Failed to read clipboard: ", err)
    return null
  }
}

/**
 * Check if Clipboard API is available
 */
export function isClipboardAvailable(): boolean {
  return !!navigator?.clipboard
}