"use client"

import Link from "next/link"
import { ModeToggle } from "../mode-toggle"
import { useAuth } from "@/lib/supabase/auth"
import { usePathname } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import React from "react"
import Reveal from "../animations/Reveal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import BackButton from "../back-button"
import { AppAvatar } from "../ui/app-avatar"
import { useAppBadges } from "@/context/AppBadgeContext"

type MobileTopbarProps = {
  titleSlot?: React.ReactNode // slot untuk menerima component dari props
  title?: string
  titleIcon?: React.ReactNode // icon kecil di samping title
  backButton?: boolean
  backHref?: string
  hideAvatarUser?: boolean // data user/group untuk avatar kecil
  endSlot?: React.ReactNode
}

export function AppTopbar({ titleSlot, title, backButton, backHref, hideAvatarUser = false, titleIcon, endSlot }: MobileTopbarProps) {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const {profile} = useAppBadges()

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
          <DropdownMenu>
            <DropdownMenuTrigger>
              <AppAvatar name={profile?.full_name || "No Name"} image={profile?.avatar_url} status="online" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem asChild>
                <Link
                  href="/app/profile"
                  className="block px-4 py-2 text-sm hover:bg-secondary"
                >
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <button
                  onClick={() => { signOut() }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-destructive transition-all"
                >
                  Logout
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
      <header className="sticky top-0 left-0 right-0 z-50 border-b bg-background px-4 py-3">
        <div className="flex items-center justify-between mx-auto">
          <div className="flex items-center flex-1">
            {/* Left section: back button */}
              {
                backButton && !backHref ? (
                  <BackButton />
                ) : null
              }
              {backHref && (
                <div className="flex items-center gap-2 mr-2">
                  <Reveal animation="fadeIn">
                    <Link href={backHref} className="text-sm text-primary hover:underline">
                      <ChevronLeft className="w-6 h-6" />
                    </Link>
                  </Reveal>
                </div>
              )}

            {/* Title slot (jika ada), kalau tidak ada, tampil default title */}
            { titleSlot ? titleSlot : (
              <div className="flex-1 flex gap-2 truncate">
                {titleIcon && <div className="w-5 h-5">{titleIcon}</div>}
                <h1 className="text-base font-semibold truncate">
                  {title || getDefaultTitle()}
                </h1>
              </div>
            ) }
          </div>

          {/* Right section: mode toggle + user menu */}
          <div className="flex items-center gap-3 justify-end">
            <ModeToggle />
            {!hideAvatarUser && userAvatarNav()}
            {endSlot && endSlot}
          </div>
        </div>
      </header>
    </>
  )
}
