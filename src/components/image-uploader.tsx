"use client"

import { useState, DragEvent, useCallback } from "react"
import Cropper, { Area } from "react-easy-crop"
import { Button } from "@/components/ui/button"
import { Upload, Loader2, X, Edit2, Eye } from "lucide-react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import Reveal from "./animations/Reveal"

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
  const [originalFiles, setOriginalFiles] = useState<File[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [cropTargetIndex, setCropTargetIndex] = useState<number | null>(null)
  const [cropFile, setCropFile] = useState<File | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [cropping, setCropping] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Mobile bottom sheet state
  const [actionIndex, setActionIndex] = useState<number | null>(null)
  const [showActions, setShowActions] = useState(false)

  // Start crop directly from a given file (avoids async state timing issues)
  const startCropFile = (file: File, index: number) => {
    const url = URL.createObjectURL(file)
    setCropFile(file)
    setPreviewUrl(url)
    setCropTargetIndex(index)
    setCropping(true)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)

    setOriginalFiles(files)
    setSelectedFiles(files)

    if (!multiple && enableCrop && files[0]) {
      startCropFile(files[0], 0)
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)

    setOriginalFiles(files)
    setSelectedFiles(files)

    if (!multiple && enableCrop && files[0]) {
      startCropFile(files[0], 0)
    }
  }

  const startCrop = (index: number) => {
    if (!enableCrop) return
    const file = originalFiles[index]
    if (!file) return
    startCropFile(file, index)
  }

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels)
  }, [])

  const getCroppedImg = async (imageSrc: string, pixels: Area): Promise<File> => {
    const image = new Image()
    image.src = imageSrc
    await new Promise((resolve) => (image.onload = resolve))

    const canvas = document.createElement("canvas")
    canvas.width = pixels.width
    canvas.height = pixels.height
    const ctx = canvas.getContext("2d")!
    ctx.drawImage(
      image,
      pixels.x,
      pixels.y,
      pixels.width,
      pixels.height,
      0,
      0,
      pixels.width,
      pixels.height
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
      const next = [...prev]
      next[cropTargetIndex] = croppedFile
      return next
    })

    // cleanup
    URL.revokeObjectURL(previewUrl)
    setCropping(false)
    setPreviewUrl(null)
    setCropTargetIndex(null)
    setCroppedAreaPixels(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
  }

  const handleRemove = (index: number) => {
    setOriginalFiles((prev) => prev.filter((_, i) => i !== index))
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (!selectedFiles.length) return
    setIsProcessing(true)
    try {
      await onUpload(selectedFiles)
      toast.success("Upload success ✅")
      setOriginalFiles([])
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fadeIn">
          <div className="relative w-[90vw] h-[70vh] bg-black rounded-lg overflow-hidden">
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
            <label className="text-white text-xs mb-1 block">Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className="flex gap-4 mt-4">
            <Button onClick={() => {
              if (previewUrl) URL.revokeObjectURL(previewUrl)
              setCropping(false)
              setPreviewUrl(null)
              setCropTargetIndex(null)
              setCroppedAreaPixels(null)
              setCrop({ x: 0, y: 0 })
              setZoom(1)
            }} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleConfirmCrop}>Confirm</Button>
          </div>
        </div>
      )}

      {/* Preview thumbnails */}
      {selectedFiles.length > 0 && (
        <div className={`${multiple ? "grid grid-cols-3 gap-3" : "flex justify-center"}`}>
          {selectedFiles.map((file, idx) => (
            <Reveal key={idx + 'thumbnail' + URL.createObjectURL(file)} animation="fadeIn">
              <div
                key={idx}
                className="relative group cursor-pointer"
                onClick={() => {
                  // Mobile: open bottom sheet
                  if (window.innerWidth < 768) {
                    setActionIndex(idx)
                    setShowActions(true)
                  } else {
                    // Desktop: go straight to crop
                    startCrop(idx)
                  }
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-24 h-24 object-cover rounded border"
                />
                {/* Desktop hover overlay */}
                {enableCrop && (
                  <div className="hidden md:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 items-center justify-center text-white text-xs transition-opacity">
                    <Edit2 className="w-4 h-4 mr-1" /> Crop
                  </div>
                )}
                {/* Desktop remove button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove(idx)
                  }}
                  className="hidden md:block absolute top-1 right-1 bg-black/60 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {/* Upload button */}
      {selectedFiles.length > 0 && (
        <Reveal animation="fadeInUp" distance={5} className="flex justify-center">
          <Button onClick={handleUpload} disabled={isProcessing} className="">
            {isProcessing && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
            Upload
          </Button>
        </Reveal>
      )}

      {/* Mobile bottom sheet actions */}
      <Dialog open={showActions} onOpenChange={setShowActions}>
        <DialogContent
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle>Actions</DialogTitle>
            <DialogDescription>Pilih aksi untuk gambar ini</DialogDescription>
          </DialogHeader>

          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              if (actionIndex !== null) startCrop(actionIndex)
              setShowActions(false)
            }}
          >
            <Edit2 className="w-4 h-4 mr-2" /> Crop
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start text-red-600"
            onClick={() => {
              if (actionIndex !== null) handleRemove(actionIndex)
              setShowActions(false)
            }}
          >
            <X className="w-4 h-4 mr-2" /> Remove
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              if (actionIndex !== null) {
                const file = selectedFiles[actionIndex]
                if (file) {
                  const url = URL.createObjectURL(file)
                  window.open(url, "_blank")
                }
              }
              setShowActions(false)
            }}
          >
            <Eye className="w-4 h-4 mr-2" /> Preview
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}