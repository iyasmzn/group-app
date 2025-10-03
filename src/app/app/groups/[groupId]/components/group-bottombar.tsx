"use client"

import Link from "next/link"
import {
  MessageCircle,
  LayoutDashboard,
  CalendarDays,
  DollarSign,
  Package,
  Handshake
} from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const tabs = [
  { href: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "chat", icon: MessageCircle, label: "Chat" },
  { href: "events", icon: CalendarDays, label: "Events" },
  { href: "finance", icon: DollarSign, label: "Finance" },
  { href: "assets", icon: Package, label: "Assets" },
  { href: "coop", icon: Handshake, label: "Koperasi" },
]

export function GroupBottombar({ groupId }: { groupId: string }) {
  const pathname = usePathname()
  // ambil segmen setelah groupId
  const parts = pathname.split("/")
  const idx = parts.indexOf(groupId)
  const active = parts[idx + 1] // misalnya "events"

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-56 border-r bg-background h-screen fixed left-0 top-0">
        <div className="flex-1 flex flex-col py-6">
          <nav className="flex-1 space-y-2 px-4">
            {tabs.map(tab => {
              const Icon = tab.icon
              const href = `/groups/${groupId}/${tab.href}`
              const isActive = pathname.startsWith(href)
              return (
                <Link
                  key={tab.href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background h-16 flex items-center z-50">
        <div className="max-w-4xl w-full mx-auto flex justify-around items-center px-4">
          {tabs.map(tab => {
            const Icon = tab.icon
            const href = `/groups/${groupId}/${tab.href}`
            const isActive = pathname.startsWith(href)
            return (
              <Link
                key={tab.href}
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center",
                  isActive ? "text-primary" : "text-gray-500"
                )}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs">{tab.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
      <div className="h-16 md:hidden" /> {/* spacer for bottom bar */}
    </>
  )
}