'use client'

import { useState, DragEvent, useCallback, useRef, ReactNode, useEffect } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import { Button } from '@/components/ui/button'
import { Upload, Loader2, X, Edit2, Eye, Camera } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import Reveal from './animations/Reveal'

export interface PreviewItem {
  file: File
  index: number
  remove: () => void
  crop: () => void
}

export interface CustomControls {
  handleUpload: () => Promise<void>
  isProcessing: boolean
  uploadProgress: number
}

export interface ImageUploaderProps {
  multiple?: boolean
  enableCrop?: boolean
  aspect?: number
  onUpload: (files: File[], onProgress?: (progress: number) => void) => Promise<void>
  customPreview?: (items: PreviewItem[]) => void
  customControls?: (controls: CustomControls) => void
}

export function ImageUploader({
  multiple = false,
  enableCrop = false,
  aspect = 1,
  onUpload,
  customPreview,
  customControls,
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
  const [uploadProgress, setUploadProgress] = useState<number>(0)

  // Mobile bottom sheet state
  const [actionIndex, setActionIndex] = useState<number | null>(null)
  const [showActions, setShowActions] = useState(false)

  const cameraInputRef = useRef<HTMLInputElement>(null)

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

    const canvas = document.createElement('canvas')
    canvas.width = pixels.width
    canvas.height = pixels.height
    const ctx = canvas.getContext('2d')!
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
        const file = new File([blob], cropFile?.name || 'cropped.jpg', { type: 'image/jpeg' })
        resolve(file)
      }, 'image/jpeg')
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
    setUploadProgress(0)

    try {
      await onUpload(selectedFiles, setUploadProgress)
      toast.success('Upload success')
      setOriginalFiles([])
      setSelectedFiles([])
    } catch (err) {
      toast.error('Upload failed')
    }
    setIsProcessing(false)
  }

  useEffect(() => {
    if (customPreview) {
      customPreview(
        selectedFiles.map((file, index) => ({
          file,
          index,
          remove: () => handleRemove(index),
          crop: () => startCrop(index),
        }))
      )
    }
  }, [selectedFiles])

  useEffect(() => {
    if (customControls) {
      customControls({
        handleUpload,
        isProcessing,
        uploadProgress,
      })
    }
  }, [selectedFiles, isProcessing, uploadProgress])

  return (
    <div className="space-y-3">
      {/* Dropzone */}
      <div
        className={`
          relative flex flex-col items-center justify-center
          border-2 border-dashed rounded-xl px-6 py-10
          transition-all cursor-pointer
          ${
            isDragging
              ? 'border-primary bg-primary/5 scale-[1.02] shadow-lg'
              : 'border-muted-foreground/30 bg-muted/30'
          }
          hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm
        `}
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
        <label
          htmlFor="image-input"
          className="flex flex-col items-center gap-3 text-sm text-muted-foreground"
        >
          <div className="p-3 rounded-full bg-muted shadow-inner">
            <Upload className="w-7 h-7 text-primary" />
          </div>
          <span className="text-sm font-medium text-center">
            {multiple
              ? 'Drag & drop images here or click to browse'
              : 'Drag & drop an image or click to select'}
          </span>
          <span className="text-xs text-muted-foreground/60">PNG, JPG up to 5MB</span>
        </label>
      </div>

      {/* input forced camera */}
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="secondary" onClick={() => cameraInputRef.current?.click()}>
          <Camera className="w-4 h-4 mr-2" /> Ambil dari kamera
        </Button>
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileSelect}
        />
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
            <Button
              type="button"
              onClick={() => {
                if (previewUrl) URL.revokeObjectURL(previewUrl)
                setCropping(false)
                setPreviewUrl(null)
                setCropTargetIndex(null)
                setCroppedAreaPixels(null)
                setCrop({ x: 0, y: 0 })
                setZoom(1)
              }}
              variant="outline"
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleConfirmCrop}>
              Confirm
            </Button>
          </div>
        </div>
      )}

      {/* Preview thumbnails */}
      <div
        className={`${
          multiple ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4' : 'flex justify-center'
        }`}
      >
        {!customPreview &&
          selectedFiles.map((file, idx) => {
            return (
              <Reveal key={idx + file.name} animation="fadeIn">
                <div
                  className="relative group rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer"
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      setActionIndex(idx)
                      setShowActions(true)
                    } else {
                      startCrop(idx)
                    }
                  }}
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-32 object-cover rounded-md"
                  />

                  {/* Overlay options */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition">
                    {enableCrop && (
                      <button
                        type="button"
                        className="p-2 bg-white/80 rounded-full shadow-md"
                        onClick={(e) => {
                          e.stopPropagation()
                          startCrop(idx)
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      className="p-2 bg-white/80 rounded-full shadow-md"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemove(idx)
                      }}
                    >
                      <X className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </Reveal>
            )
          })}
      </div>

      {/* Progress upload */}
      {isProcessing && (
        <div className="w-full bg-muted rounded-lg h-2 mt-2 overflow-hidden">
          <div className="bg-primary h-2 transition-all" style={{ width: `${uploadProgress}%` }} />
        </div>
      )}
      {isProcessing && (
        <p className="text-xs text-muted-foreground text-center">Uploading... {uploadProgress}%</p>
      )}

      {/* Upload button */}
      {!customControls && selectedFiles.length > 0 && (
        <Reveal animation="fadeInUp" distance={5} className="flex justify-center">
          <Button type="button" onClick={handleUpload} disabled={isProcessing} className="">
            {isProcessing && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
            Upload
          </Button>
        </Reveal>
      )}

      {/* Mobile bottom sheet actions */}
      <Dialog open={showActions} onOpenChange={setShowActions}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Actions</DialogTitle>
            <DialogDescription>Pilih aksi untuk gambar ini</DialogDescription>
          </DialogHeader>

          {enableCrop && (
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                if (actionIndex !== null) startCrop(actionIndex)
                setShowActions(false)
              }}
            >
              <Edit2 className="w-4 h-4 mr-2" /> Crop
            </Button>
          )}

          <Button
            type="button"
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
            type="button"
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              if (actionIndex !== null) {
                const file = selectedFiles[actionIndex]
                if (file) {
                  const url = URL.createObjectURL(file)
                  window.open(url, '_blank')
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
