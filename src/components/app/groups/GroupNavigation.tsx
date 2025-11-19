'use client'

import Link from 'next/link'
import {
  MessageCircle,
  LayoutDashboard,
  CalendarDays,
  DollarSign,
  Package,
  Handshake,
} from 'lucide-react'
import { useGroupBadges } from '@/context/GroupBadgeContext'
import { usePathname, useParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export function GroupNavigation() {
  const pathname = usePathname()
  const params = useParams()
  const groupId = params.groupId as string
  const isChatPage = pathname?.includes('/chat')

  const { chat, finance, coop } = useGroupBadges()

  const tabs = [
    { href: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: 'chat', icon: MessageCircle, label: 'Chat', badge: chat },
    { href: 'events', icon: CalendarDays, label: 'Events', badge: 0 },
    { href: 'finance', icon: DollarSign, label: 'Finance', badge: finance },
    { href: 'assets', icon: Package, label: 'Assets', badge: 0 },
    { href: 'coop', icon: Handshake, label: 'Koperasi', badge: coop },
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="hidden md:flex md:flex-col md:w-56 border-r bg-background h-screen fixed left-0 top-14"
      >
        <div className="flex-1 flex flex-col py-6">
          <nav className="flex-1 space-y-2 px-4 relative">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const href = `/app/groups/${groupId}/${tab.href}`
              const isActive = pathname.startsWith(href)
              return (
                <Link
                  key={tab.href}
                  href={href}
                  className={cn(
                    'relative flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive ? 'text-primary' : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeHighlight"
                      className="absolute inset-0 rounded-md bg-primary/10"
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 25,
                        bounce: 0.35, // pantulan lebih terasa
                        duration: 0.4, // durasi singkat
                        ease: 'easeInOut',
                      }}
                    />
                  )}
                  <Icon className="h-5 w-5 relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                  {typeof tab.badge === 'number' && tab.badge > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5 relative z-10"
                    >
                      {tab.badge}
                    </motion.span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </motion.aside>
      {/* Mobile Bottom Bar */}
      {!isChatPage && (
        <motion.nav
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 25,
            bounce: 0.35, // pantulan lebih terasa
            duration: 0.4, // durasi singkat
            ease: 'easeInOut',
          }}
          className="md:hidden fixed bottom-0 left-0 right-0 border mx-1 mb-1 bg-background h-16 flex items-center z-50 rounded-2xl"
        >
          <div className="max-w-4xl w-full mx-auto flex justify-around items-center px-2 relative">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const href = `/app/groups/${groupId}/${tab.href}`
              const isActive = pathname.startsWith(href)
              return (
                <Link
                  key={tab.href}
                  href={href}
                  className={cn(
                    'relative flex flex-col items-center justify-center px-3 py-1 rounded-md',
                    isActive ? 'text-primary' : 'text-gray-500'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeHighlightMobile"
                      className="absolute inset-0 rounded-xl bg-primary/10"
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 25,
                        bounce: 0.35, // pantulan lebih terasa
                        duration: 0.5, // durasi singkat
                        ease: 'easeInOut',
                      }}
                    />
                  )}
                  <Icon className="h-6 w-6 relative z-10" />
                  <span className="text-xs relative z-10">{tab.label}</span>
                  {typeof tab.badge == 'number' && tab.badge > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-0 right-2 bg-red-500 text-white text-[10px] rounded-full px-1.5 z-10"
                    >
                      {tab.badge}
                    </motion.span>
                  )}
                </Link>
              )
            })}
          </div>
        </motion.nav>
      )}
      <div className="h-16 md:hidden" /> {/* spacer for bottom bar */}
    </>
  )
}
