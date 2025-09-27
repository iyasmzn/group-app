"use client"

import { useState, DragEvent } from "react"
import { Upload, Loader2, Trash2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface FileUploaderProps {
  accept?: string
  multiple?: boolean
  onUpload: (files: File[]) => Promise<any>
  onRemove?: (file: File | string) => Promise<void>
}

export function FileUploader({
  accept = "*/*",
  multiple = false,
  onUpload,
  onRemove,
}: FileUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setSelectedFiles(Array.from(e.target.files))
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    setSelectedFiles(Array.from(e.dataTransfer.files))
  }

  const handleUpload = async () => {
    if (!selectedFiles.length) return
    setIsProcessing(true)
    try {
      await onUpload(selectedFiles)
      toast.success("Upload success ✅")
      setSelectedFiles([])
    } catch (err) {
      console.error(err)
      toast.error("Upload failed ❌")
    }
    setIsProcessing(false)
  }

  const handleRemove = async (file: File) => {
    if (!onRemove) {
      setSelectedFiles((prev) => prev.filter((f) => f !== file))
      return
    }
    setIsProcessing(true)
    try {
      await onRemove(file)
      setSelectedFiles((prev) => prev.filter((f) => f !== file))
      toast.success("File removed")
    } catch (err) {
      console.error(err)
      toast.error("Failed to remove file")
    }
    setIsProcessing(false)
  }

  return (
    <div className="space-y-3">
      {/* Dropzone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/30"
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          id="file-input"
          onChange={handleFileSelect}
        />
        <label htmlFor="file-input" className="flex flex-col items-center gap-2">
          <Upload className="w-6 h-6 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {multiple ? "Drag & drop files here or click to select" : "Drag & drop a file here or click to select"}
          </span>
        </label>
      </div>

      {/* Preview */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          {selectedFiles.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between border rounded p-2">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <span className="truncate text-sm">{file.name}</span>
              </div>
              <Button
                size="sm"
                variant="destructive-outline"
                onClick={() => handleRemove(file)}
                disabled={isProcessing}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {selectedFiles.length > 0 && (
        <Button onClick={handleUpload} disabled={isProcessing}>
          {isProcessing && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
          Upload
        </Button>
      )}
    </div>
  )
}