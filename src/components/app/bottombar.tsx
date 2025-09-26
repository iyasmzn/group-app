"use client"
import Link from "next/link"
import { Home, Users, MessageCircle, Settings } from "lucide-react"
import { usePathname } from "next/navigation"

export function AppBottombar() {
  const pathname = usePathname()

  const tabs = [
    { href: "/app/home", icon: <Home className="h-6 w-6" />, label: "Home" },
    { href: "/app/chat", icon: <MessageCircle className="h-6 w-6" />, label: "Chat" },
    { href: "/app/groups", icon: <Users className="h-6 w-6" />, label: "Groups" },
    { href: "/app/settings", icon: <Settings className="h-6 w-6" />, label: "Settings" },
  ]

  return (
    <>
      {/* Mobile Bottom Tabs */}
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-background h-16 flex items-center z-50">
        <div className="max-w-4xl w-full mx-auto flex justify-around items-center px-4">
          {tabs.map(tab => {
            const active = pathname === tab.href
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center justify-center ${active ? "text-primary" : "text-gray-500"}`}
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