"use client"

import { User } from "@supabase/supabase-js"
import { useState } from "react"

type UserAvatarProps = {
  user: User | null
  size?: number // ukuran avatar, default 40px
  textSize?: number // ukuran teks inisial, default 14px
  onClick?: () => void
  status?: "online" | "offline" | "away" // indicator status
}

// Warna background per abjad (A-Z)
const colors = [
  "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-yellow-500",
  "bg-lime-500", "bg-green-500", "bg-emerald-500", "bg-teal-500",
  "bg-cyan-500", "bg-sky-500", "bg-blue-500", "bg-indigo-500",
  "bg-violet-500", "bg-purple-500", "bg-fuchsia-500", "bg-pink-500",
  "bg-rose-500", "bg-gray-500"
]

export function UserAvatar({ user, size = 40, onClick, status, textSize = 14 }: UserAvatarProps) {
  const [imgError, setImgError] = useState(false)

  const getInitials = () => {
    let name = user?.user_metadata?.full_name || user?.email || "User"
    name = name.trim()
    if (name.length === 1) return name.toUpperCase()
    return (
      name.slice(0, 1).toUpperCase() +
      name.slice(1, 2).toLowerCase()
    )
  }

  const initials = getInitials()
  const avatarUrl = !imgError ? user?.user_metadata?.avatar_url : null

  // Tentukan warna background dari huruf pertama
  const firstChar = initials[0]?.toUpperCase() || "A"
  const charCode = firstChar.charCodeAt(0) - 65 // A=0, B=1, ...
  const bgColor = colors[charCode % colors.length]

  return (
    <div
      onClick={onClick}
      style={{ width: size, height: size }}
      className="relative cursor-pointer"
    >
      <div
        className={`rounded-full overflow-hidden border flex items-center justify-center text-sm font-semibold text-white ${!avatarUrl ? bgColor : ""}`}
        style={{ width: size, height: size }}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span style={{ fontSize: textSize}}>{initials}</span>
        )}
      </div>

      {/* Status Indicator */}
      {status && (
        <span
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
            ${status === "online" ? "bg-green-500" : ""}
            ${status === "offline" ? "bg-gray-400" : ""}
            ${status === "away" ? "bg-yellow-400" : ""}
          `}
        />
      )}
    </div>
  )
}
