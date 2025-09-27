"use client"

import { ImageUploader } from "@/components/image-uploader"
import { FileUploader } from "@/components/file-uploader"

export interface UnifiedUploaderProps {
  /** Tipe file yang diterima, default "*/
  accept?: string
  /** Apakah bisa multiple upload */
  multiple?: boolean
  /** Khusus image: aktifkan crop */
  enableCrop?: boolean
  /** Ratio crop (1 = square, 16/9 = widescreen, dll) */
  aspect?: number
  /** Callback ketika upload, wajib return Promise<void> */
  onUpload: (files: File[]) => Promise<void>
  /** Callback optional untuk remove file */
  onRemove?: (file?: File | string) => Promise<void>
}

export function UnifiedUploader({
  accept = "*/*",
  multiple = false,
  enableCrop = false,
  aspect = 1,
  onUpload,
  onRemove,
}: UnifiedUploaderProps) {
  const isImage = accept.includes("image")

  if (isImage) {
    return (
      <ImageUploader
        multiple={multiple}
        enableCrop={enableCrop}
        aspect={aspect}
        onUpload={onUpload}
      />
    )
  }

  return (
    <FileUploader
      accept={accept}
      multiple={multiple}
      onUpload={onUpload}
      onRemove={onRemove}
    />
  )
}