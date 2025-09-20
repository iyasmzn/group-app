"use client"
import Link from "next/link"
import { Home, Users, MessageCircle, Settings } from "lucide-react"
import { usePathname } from "next/navigation"

export function AppBottombar() {
  const pathname = usePathname()

  const tabs = [
    { href: "/app/home", icon: <Home className="h-6 w-6" />, label: "Home" },
    { href: "/app/groups", icon: <Users className="h-6 w-6" />, label: "Groups" },
    { href: "/app/chat", icon: <MessageCircle className="h-6 w-6" />, label: "Chat" },
    { href: "/app/settings", icon: <Settings className="h-6 w-6" />, label: "Settings" },
  ]

  return (
    <>
      {/* Mobile Bottom Tabs */}
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-background flex justify-around items-center h-16">
        {tabs.map(tab => {
          const active = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center ${active ? "text-blue-600" : "text-gray-500"}`}
            >
              {tab.icon}
              <span className="text-xs">{tab.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}