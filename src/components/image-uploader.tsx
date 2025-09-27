"use client"

import { useState, DragEvent, useCallback } from "react"
import Cropper, { Area } from "react-easy-crop"
import { Button } from "@/components/ui/button"
import { Upload, Loader2 } from "lucide-react"
import { toast } from "sonner"

export interface ImageUploaderProps {
  multiple?: boolean
  enableCrop?: boolean
  aspect?: number
  onUpload: (files: File[]) => Promise<void>
}

export function ImageUploader({
  multiple = false,
  enableCrop = false,
  aspect = 1,
  onUpload,
}: ImageUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [cropTargetIndex, setCropTargetIndex] = useState<number | null>(null)
  const [cropFile, setCropFile] = useState<File | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [cropping, setCropping] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)
    if (multiple) {
      setSelectedFiles(files)
    } else {
      const file = files[0]
      if (enableCrop) {
        startCrop(file, 0)
      } else {
        setSelectedFiles([file])
      }
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    if (multiple) {
      setSelectedFiles(files)
    } else {
      const file = files[0]
      if (enableCrop) {
        startCrop(file, 0)
      } else {
        setSelectedFiles([file])
      }
    }
  }

  const startCrop = (file: File, index: number) => {
    if (!enableCrop) return
    setCropFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setCropTargetIndex(index)
    setCropping(true)
  }

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const getCroppedImg = async (imageSrc: string, cropAreaPixels: Area): Promise<File> => {
    const image = new Image()
    image.src = imageSrc
    await new Promise((resolve) => (image.onload = resolve))

    const canvas = document.createElement("canvas")
    canvas.width = cropAreaPixels.width
    canvas.height = cropAreaPixels.height
    const ctx = canvas.getContext("2d")!
    ctx.drawImage(
      image,
      cropAreaPixels.x,
      cropAreaPixels.y,
      cropAreaPixels.width,
      cropAreaPixels.height,
      0,
      0,
      cropAreaPixels.width,
      cropAreaPixels.height
    )

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return
        const file = new File([blob], cropFile?.name || "cropped.jpg", { type: "image/jpeg" })
        resolve(file)
      }, "image/jpeg")
    })
  }

  const handleConfirmCrop = async () => {
    if (!previewUrl || !croppedAreaPixels || cropTargetIndex === null) return
    const croppedFile = await getCroppedImg(previewUrl, croppedAreaPixels)

    setSelectedFiles((prev) => {
      const newFiles = [...prev]
      newFiles[cropTargetIndex] = croppedFile
      return newFiles
    })

    setCropping(false)
    setPreviewUrl(null)
    setCropTargetIndex(null)
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

  return (
    <div className="space-y-3">
      {/* Dropzone */}
      <div
        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          id="image-input"
          onChange={handleFileSelect}
        />
        <label htmlFor="image-input" className="flex flex-col items-center gap-2">
          <Upload className="w-6 h-6 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {multiple
              ? "Drag & drop images here or click to select"
              : "Drag & drop an image here or click to select"}
          </span>
        </label>
      </div>

      {/* Crop overlay */}
      {cropping && previewUrl && (
        <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
          <div className="relative w-[90vw] h-[70vh] bg-black">
            <Cropper
              image={previewUrl}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          {/* Zoom slider */}
          <div className="mt-4 w-64">
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex gap-4 mt-4">
            <Button onClick={() => setCropping(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleConfirmCrop}>Confirm</Button>
          </div>
        </div>
      )}

      {/* Preview thumbnails */}
      {selectedFiles.length > 0 && (
        <div className={`grid ${multiple ? "grid-cols-3 gap-3" : ""}`}>
          {selectedFiles.map((file, idx) => (
            <div
              key={idx}
              className="relative group cursor-pointer"
              onClick={() => startCrop(file, idx)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-24 h-24 object-cover rounded"
              />
              {enableCrop && multiple && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs">
                  Crop
                </div>
              )}
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