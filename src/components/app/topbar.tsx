"use client"

import Link from "next/link"
import { ModeToggle } from "../mode-toggle"
import { UserAvatar } from "../user-avatar"
import { useAuth } from "@/lib/supabase/auth"
import { usePathname } from "next/navigation"
import { ChevronLeftCircle } from "lucide-react"
import { useState } from "react"

type MobileTopbarProps = {
  title?: string
  titleIcon?: React.ReactNode // icon kecil di samping title
  backHref?: string
  hideAvatarUser?: boolean // data user/group untuk avatar kecil
}

export function AppTopbar({ title, backHref, hideAvatarUser = false, titleIcon }: MobileTopbarProps) {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const getDefaultTitle = () => {
    if (pathname.startsWith("/app/home")) return "Home"
    if (pathname.startsWith("/app/groups")) return "Groups"
    if (pathname.startsWith("/app/chat")) return "Chat"
    if (pathname.startsWith("/app/settings")) return "Settings"
    return "Group App"
  }

  

  const userAvatarNav = () => {
    if (user) {
      return (
        <div className="relative">
          <UserAvatar user={user} size={32} onClick={() => setMenuOpen(!menuOpen)} status="online" />
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 border rounded-lg shadow-lg overflow-hidden bg-background">
              <Link
                href="/app/profile"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                Profile
              </Link>
              <button
                onClick={() => { setMenuOpen(false); signOut() }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )
    }
    return (
      <Link href="/login" className="text-sm px-3 py-1 border rounded">
        Login
      </Link>
    )
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background flex items-center justify-between px-4 py-3">
        {/* Left section: back button */}
          {backHref && (
            <div className="flex items-center gap-2 mr-2">
              <Link href={backHref} className="text-sm text-primary hover:underline">
                <ChevronLeftCircle className="w-6 h-6" />
              </Link>
            </div>
          )}

        {/* Center section: avatar (optional) + title */}
        <div className="flex-1 flex gap-2 truncate">
          {titleIcon && <div className="w-5 h-5">{titleIcon}</div>}
          <h1 className="text-base font-semibold truncate">
            {title || getDefaultTitle()}
          </h1>
        </div>

        {/* Right section: mode toggle + user menu */}
        <div className="flex items-center gap-3 w-20 justify-end">
          <ModeToggle />
          {!hideAvatarUser && userAvatarNav()}
        </div>
      </header>
      
      {/* Spacer supaya konten tidak ketiban topbar */}
      <div className="h-14" /> {/* untuk topbar */}
    </>
  )
}
