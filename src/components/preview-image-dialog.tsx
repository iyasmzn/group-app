"use client"

import Image from "next/image"
import { Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type PreviewImageProps = {
  name: string
  image: string
  thumb?: string // blur thumbnail dari Cloudinary
}

export function PreviewImageDialog({ name, image, thumb }: PreviewImageProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-2 rounded-full bg-white/20 hover:bg-white/40">
          <Eye className="w-5 h-5 text-white" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogTitle>Preview Image</DialogTitle>

        <Image
          src={image}
          alt={name}
          width={400}
          height={400}
          placeholder={thumb ? "blur" : "empty"}
          blurDataURL={thumb}
          className={cn(
            "w-full h-auto rounded-lg object-cover transition-opacity duration-300"
          )}
        />
      </DialogContent>
    </Dialog>
  )
}