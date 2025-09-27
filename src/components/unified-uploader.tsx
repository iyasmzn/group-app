"use client"

import { ImageUploader } from "@/components/image-uploader"
import { FileUploader } from "@/components/file-uploader"

interface UnifiedUploaderProps {
  accept?: string
  multiple?: boolean
  enableCrop?: boolean
  aspect?: number
  onUpload: (files: File[]) => Promise<any>
  onRemove?: (file: File | string) => Promise<void>
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