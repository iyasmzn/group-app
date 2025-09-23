"use client"

import React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface GroupAvatarProps {
  name: string
  image?: string | null
  size?: "sm" | "md" | "lg" | "xl" | "xxl"
  className?: string
}

// 🔹 ambil inisial
function getGroupInitials(name: string) {
  if (!name) return "?"
  const words = name.trim().split(" ").filter(Boolean)
  if (words.length === 1) return words[0][0].toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}

// 🔹 warna background konsisten
function getAvatarColor(name: string) {
  const palette = [
    "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-yellow-500",
    "bg-lime-500", "bg-green-500", "bg-emerald-500", "bg-teal-500",
    "bg-cyan-500", "bg-sky-500", "bg-blue-500", "bg-indigo-500",
    "bg-violet-500", "bg-purple-500", "bg-fuchsia-500", "bg-pink-500",
    "bg-rose-500"
  ]
  const char = name[0]?.toUpperCase() || "A"
  const index = (char.charCodeAt(0) - 65) % palette.length
  return palette[index]
}

export function GroupAvatar({ name, image, size = "md", className }: GroupAvatarProps) {
  const initials = getGroupInitials(name)
  const bg = getAvatarColor(name)

  const sizeMap = {
    sm: { box: "w-8 h-8 text-sm", img: 32 },
    md: { box: "w-10 h-10 text-base", img: 40 },
    lg: { box: "w-14 h-14 text-lg", img: 56 },
    xl: { box: "w-24 h-24 text-3xl", img: 72 },
    xxl: { box: "w-32 h-32 text-4xl", img: 86 },
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full overflow-hidden",
        sizeMap[size].box,
        !image && bg, // hanya pakai bg kalau tidak ada image
        className
      )}
    >
      {image ? (
        <img
          src={image}
          alt={name}
          width={sizeMap[size].img}
          height={sizeMap[size].img}
          className="object-cover w-full h-full"
        />
      ) : (
        <span className="font-bold text-white">{initials}</span>
      )}
    </div>
  )
}
