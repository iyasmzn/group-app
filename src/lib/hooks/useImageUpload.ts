import { useState, useRef } from 'react'
import { uploadToCloudinary } from '../cloudinary'

export function useImageUpload() {
  const [progress, setProgress] = useState<number>(0)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const upload = async (file: File) => {
    setIsUploading(true)
    setError(null)

    try {
      const result = await uploadToCloudinary(file, {
        onProgress: (p) => setProgress(p),
      })

      return result
    } catch (err) {
      setError(String(err))
      return null
    } finally {
      setIsUploading(false)
    }
  }

  return {
    upload,
    progress,
    isUploading,
    error,
  }
}
