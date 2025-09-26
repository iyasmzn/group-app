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
import { useLastSegment } from "@/lib/hooks/useLastSegment"
import { useGroupBadges } from "@/context/GroupBadgeContext"
import { usePathname } from "next/navigation"

export function GroupNavigation() {
  const active = useLastSegment()
  const pathname = usePathname()
  const isChatPage = pathname?.includes("/chat")

  
  const {unread, events, finance ,assets, coop} = useGroupBadges()

  const tabs = [
    { href: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "chat", icon: MessageCircle, label: "Chat", badge: unread },
    { href: "events", icon: CalendarDays, label: "Events", badge: events },
    { href: "finance", icon: DollarSign, label: "Finance", badge: finance },
    { href: "assets", icon: Package, label: "Assets", badge: assets },
    { href: "coop", icon: Handshake, label: "Koperasi", badge: coop },
  ]


  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-56 border-r bg-background h-screen fixed left-0 top-14">
        <div className="flex-1 flex flex-col py-6">
          <nav className="flex-1 space-y-2 px-4">
            {tabs.map(tab => {
              const Icon = tab.icon
              const isActive = active === tab.href
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                  {/* ✅ Badge unread khusus Chat */}
                  {tab.badge && tab.badge > 0 ? (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5 animate-pulse">
                      {tab.badge}
                    </span>
                  ) : null }
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      {
        !isChatPage && 
        <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background h-16 flex items-center z-50">
          <div className="max-w-4xl w-full mx-auto flex justify-around items-center px-4">
            {tabs.map(tab => {
              const Icon = tab.icon
              const isActive = active === tab.href
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`relative flex flex-col items-center justify-center ${
                    isActive ? "text-primary" : "text-gray-500"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs">{tab.label}</span>
                  {/* ✅ Badge untuk semua tab yang punya badge */}
                  {tab.badge && tab.badge > 0 ? (
                    <span className="absolute top-0 right-2 bg-red-500 text-white text-[10px] rounded-full px-1.5 animate-pulse">
                      {tab.badge}
                    </span>
                  ) : null}
                </Link>
              )
            })}
          </div>
        </nav>
      }
      <div className="h-16 md:hidden" /> {/* spacer for bottom bar */}
    </>
  )
}