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

const tabs = [
  { href: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "chat", icon: MessageCircle, label: "Chat" },
  { href: "events", icon: CalendarDays, label: "Events" },
  { href: "finance", icon: DollarSign, label: "Finance" },
  { href: "assets", icon: Package, label: "Assets" },
  { href: "coop", icon: Handshake, label: "Koperasi" },
]

export function GroupBottombar() {
  const active = useLastSegment()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-56 border-r bg-background h-screen fixed left-0 top-0">
        <div className="flex-1 flex flex-col py-6">
          <nav className="flex-1 space-y-2 px-4">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    active === tab.href 
                      ? "bg-primary/10 text-primary" 
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
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
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center ${
                  active === tab.href ? "text-primary" : "text-gray-500"
                }`}
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