"use client"

import { useState } from "react"
import { Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Avatar as UiAvatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar"
import { PreviewImageDialog } from "../preview-image-dialog"
import { getBlurThumbnailUrl } from "@/lib/cloudinary"

type AppAvatarProps = {
  name: string
  image?: string | null
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl"
  className?: string
  hoverAction?: { icon?: React.ReactNode; onClick?: () => void }
  preview?: boolean
  status?: "online" | "offline" | "away"
}

const sizeMap = {
  xs: "w-5 h-5 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-14 h-14 text-lg",
  xl: "w-24 h-24 text-2xl",
  xxl: "w-32 h-32 text-4xl",
}

function getAvatarColor(name: string) {
  const palette = [
    "bg-red-500","bg-orange-500","bg-amber-500","bg-yellow-500",
    "bg-lime-500","bg-green-500","bg-emerald-500","bg-teal-500",
    "bg-cyan-500","bg-sky-500","bg-blue-500","bg-indigo-500",
    "bg-violet-500","bg-purple-500","bg-fuchsia-500","bg-pink-500","bg-rose-500"
  ]
  const char = name[0]?.toUpperCase() || "A"
  const index = (char.charCodeAt(0) - 65) % palette.length
  return palette[index]
}

export function AppAvatar({
  name,
  image,
  size = "md",
  className,
  hoverAction,
  preview,
  status,
}: AppAvatarProps) {
  const [open, setOpen] = useState(false)
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U"
  const bg = getAvatarColor(name)

  return (
    <div className="relative inline-block">
      <UiAvatar
        className={cn(
          "relative flex items-center justify-center overflow-hidden rounded-full",
          sizeMap[size],
          !image && bg,
          className
        )}
      >
        {image ? (
          <AvatarImage src={image} alt={name} />
        ) : (
          <AvatarFallback className="text-white font-bold">
            {initials}
          </AvatarFallback>
        )}
      </UiAvatar>

      {/* Overlay actions */}
      {(preview || hoverAction) && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 hover:opacity-100 transition">
          {preview && image && (
            <PreviewImageDialog
              name={name}
              image={image}
              thumb={getBlurThumbnailUrl(image)} // contoh generate blur thumbnail
            />
          )}



          {hoverAction && (
            <button
              type="button"
              onClick={hoverAction.onClick}
              className="p-2 rounded-full bg-white/20 hover:bg-white/40"
            >
              {hoverAction.icon ?? <Settings className="w-5 h-5 text-white" />}
            </button>
          )}
        </div>
      )}

      {/* Status indicator */}
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
            status === "online" && "bg-green-500",
            status === "offline" && "bg-gray-400",
            status === "away" && "bg-yellow-400"
          )}
        />
      )}
    </div>
  )
}