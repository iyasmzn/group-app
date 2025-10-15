"use client"
import Link from "next/link"
import { Home, Users, MessageCircle, Settings } from "lucide-react"
import { usePathname } from "next/navigation"
import { useAppBadges } from "@/context/AppBadgeContext"

export function AppBottombar() {
  const pathname = usePathname()
  const { chat, groups } = useAppBadges()

  const tabs = [
    { href: "/app/home", icon: Home, label: "Home" },
    { href: "/app/chat", icon: MessageCircle, label: "Chat", badge: chat },
    { href: "/app/groups", icon: Users, label: "Groups", badge: groups },
    { href: "/app/settings", icon: Settings, label: "Settings" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-background h-16 flex items-center z-50">
      <div className="max-w-4xl w-full mx-auto flex justify-around items-center px-4">
        {tabs.map((tab) => {
          const active = pathname === tab.href
          const Icon = tab.icon
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex flex-col items-center justify-center ${
                active ? "text-primary" : "text-gray-500"
              }`}
            >
              <div className="relative">
                <Icon className="h-6 w-6" />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-medium rounded-full px-1.5">
                    {tab.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-xs">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}