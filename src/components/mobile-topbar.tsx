"use client"

import Link from "next/link"
import { ModeToggle } from "./mode-toggle"
import { UserAvatar } from "./user-avatar"
import { useAuth } from "@/lib/supabase/auth"
import { usePathname } from "next/navigation"
import { ChevronLeftCircle } from "lucide-react"

type MobileTopbarProps = {
  title?: string
  titleIcon?: React.ReactNode // icon kecil di samping title
  backHref?: string
  hideAvatarUser?: boolean // data user/group untuk avatar kecil
}

export function MobileTopbar({ title, backHref, hideAvatarUser = false, titleIcon }: MobileTopbarProps) {
  const { user, signOut } = useAuth()
  const pathname = usePathname()

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
          <UserAvatar user={user} size={28} status="online" />
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
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 border-b bg-background flex items-center justify-between px-4 py-3">
        {/* Left section: back button */}
          {backHref && (
            <div className="flex items-center gap-2 mr-2">
              <Link href={backHref} className="text-sm text-blue-600 hover:underline">
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
      <div className="h-14 md:hidden" /> {/* untuk topbar */}
    </>
  )
}
