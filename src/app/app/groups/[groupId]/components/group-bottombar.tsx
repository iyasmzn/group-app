"use client"
import Link from "next/link"
import { MessageCircle, LayoutDashboard, CalendarDays, DollarSign } from "lucide-react"
import { usePathname } from "next/navigation"
import { useLastSegment } from "@/lib/hooks/useLastSegment"

export function GroupBottombar() {
  const pathname = usePathname()
  const active = useLastSegment()

  const tabs = [
    { href: "dashboard", icon: <LayoutDashboard className="h-6 w-6" />, label: "Dashboard" },
    { href: "chat", icon: <MessageCircle className="h-6 w-6" />, label: "Chat" },
    { href: "event", icon: <CalendarDays className="h-6 w-6" />, label: "Event" },
    { href: "finance", icon: <DollarSign className="h-6 w-6" />, label: "Finance" },
  ]

  return (
    <>
      {/* Mobile Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-background h-16 flex items-center z-50">
        <div className="max-w-4xl w-full mx-auto flex justify-around items-center px-4">
          {tabs.map(tab => {
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center ${active == tab.href ? "text-primary" : "text-gray-500"}`}
              >
                {tab.icon}
                <span className="text-xs">{tab.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
      <div className="h-16" /> {/* spacer for bottom bar */}
    </>
  )
}