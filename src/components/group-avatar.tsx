"use client"

import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Settings, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface GroupAvatarProps {
  name: string
  image?: string | null
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl"
  className?: string
  hoverAction?: {
    icon?: React.ReactNode
    onClick?: () => void
  }
}

function getGroupInitials(name: string) {
  if (!name) return "?"
  const words = name.trim().split(" ").filter(Boolean)
  if (words.length === 1) return words[0][0].toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
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

export function GroupAvatar({
  name,
  image,
  size = "md",
  className,
  hoverAction,
}: GroupAvatarProps) {
  const initials = getGroupInitials(name)
  const bg = getAvatarColor(name)
  const [open, setOpen] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // ✅ close overlay ketika klik di luar
  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowOverlay(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("touchstart", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [])

  const sizeMap = {
    xs: { box: "w-5 h-5 text-sm", img: 20 },
    sm: { box: "w-8 h-8 text-sm", img: 32 },
    md: { box: "w-10 h-10 text-base", img: 40 },
    lg: { box: "w-14 h-14 text-lg", img: 56 },
    xl: { box: "w-24 h-24 text-3xl", img: 72 },
    xxl: { box: "w-32 h-32 text-4xl", img: 86 },
  }

  return (
    <div
      ref={ref}
      className={cn(
        "relative group flex items-center justify-center rounded-full overflow-hidden",
        sizeMap[size].box,
        !image && bg,
        className
      )}
      onClick={() => setShowOverlay(!showOverlay)} // toggle di mobile
    >
      {image ? (
        <Image
          src={image}
          alt={name}
          width={sizeMap[size].img}
          height={sizeMap[size].img}
          className="object-cover w-full h-full"
        />
      ) : (
        <span className="font-bold text-white">{initials}</span>
      )}

      {/* Overlay */}
      {(image || hoverAction) && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center gap-2 bg-black/40",
            "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0",
            showOverlay && "opacity-100 translate-y-0",
            "transition-all duration-300 ease-out"
          )}
        >
          {/* Preview action */}
          {image && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "p-2 rounded-full bg-white/20 hover:bg-white/40 transition-all duration-300 ease-out delay-0",
                    "opacity-0 translate-y-2 scale-90 pointer-events-none",
                    "group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:pointer-events-auto",
                    showOverlay && "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                  )}
                >
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
                  className="w-full h-auto rounded-lg object-cover"
                />
              </DialogContent>
            </Dialog>
          )}

          {/* Custom action */}
          {hoverAction && (
            <button
              type="button"
              onClick={hoverAction.onClick}
              className={cn(
                "p-2 rounded-full bg-white/20 hover:bg-white/40 transition-all duration-300 ease-out delay-100",
                "opacity-0 translate-y-2 scale-90 pointer-events-none",
                "group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:pointer-events-auto",
                showOverlay && "opacity-100 translate-y-0 scale-100 pointer-events-auto"
              )}
            >
              {hoverAction.icon ?? <Settings className="w-5 h-5 text-white" />}
            </button>
          )}
        </div>
      )}
    </div>
  )
}