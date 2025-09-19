"use client"
import Link from "next/link"
import { useAuth } from "@/lib/supabaseAuth"
import { ModeToggle } from "./mode-toggle"
import { Home, Users, MessageCircle, User, Settings } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { UserAvatar } from "./user-avatar"

export function NavbarApp() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const tabs = [
    { href: "/app/home", icon: <Home className="h-6 w-6" />, label: "Home" },
    { href: "/app/groups", icon: <Users className="h-6 w-6" />, label: "Groups" },
    { href: "/app/chat", icon: <MessageCircle className="h-6 w-6" />, label: "Chat" },
    { href: "/app/settings", icon: <Settings className="h-6 w-6" />, label: "Setting" },
  ]

  const userAvatarNav = () => {
    if (user) {
      return (
        <div className="relative">
          <UserAvatar user={user} size={32} onClick={() => setMenuOpen(!menuOpen)} status="online" />

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 border rounded-lg shadow-lg overflow-hidden">
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
      {/* Desktop Navbar */}
      <div className="hidden md:sticky border-b md:top-0 md:z-50 md:block md:w-full md:bg-background">
        <header className="hidden md:flex bg-background p-4 items-center justify-between max-w-6xl mx-auto">
          <Link href="/" className="font-bold text-xl">Group App</Link>
          <div className="flex items-center gap-6">
            <Link href="/app/home">Home</Link>
            <Link href="/app/groups">Groups</Link>
            <Link href="/app/chat">Chat</Link>
            <ModeToggle />
            {userAvatarNav()}
          </div>
        </header>
      </div>

      {/* Mobile Topbar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 border-b bg-background flex items-center justify-between px-4 py-3">
        <Link href="/app/home" className="font-bold text-lg">Group App</Link>
        <div className="flex items-center gap-3 relative">
          <ModeToggle />
          {userAvatarNav()}
        </div>
      </header>

      {/* Mobile Bottom Tabs */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden border-t bg-background flex justify-around items-center h-16">
        {tabs.map(tab => {
          const active = pathname === tab.href
          return (
            <Link key={tab.href} href={tab.href} className={`flex flex-col items-center justify-center ${active ? "text-blue-600" : "text-gray-500"}`}>
              {tab.icon}
              <span className="text-xs">{tab.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Spacer supaya konten tidak ketiban navbar */}
      <div className="h-14 md:hidden" /> {/* untuk topbar */}
    </>
  )
}
