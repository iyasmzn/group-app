'use client'

import Link from 'next/link'
import { Home, Users, MessageCircle, Settings } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'
import { useNotifications } from '@/context/notification/NotificationContext'

export function AppBottombar() {
  const pathname = usePathname()
  const { unread } = useNotifications()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // trigger animasi hanya sekali saat komponen pertama kali mount
    setMounted(true)
  }, [])

  console.log('BottomBar unread:', unread)

  const chatUnread = Object.values(unread.chat || {}).reduce((sum, count) => sum + count, 0)

  const tabs = [
    { href: '/app/home', icon: Home, label: 'Home' },
    { href: '/app/chat', icon: MessageCircle, label: 'Chat', badge: chatUnread },
    { href: '/app/groups', icon: Users, label: 'Groups' },
    { href: '/app/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <TooltipProvider>
      <motion.nav
        initial={{ y: 80, opacity: 0 }}
        animate={mounted ? { y: 0, opacity: 1 } : {}}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 
                   bg-background/90 backdrop-blur-md 
                   border shadow-lg rounded-full 
                   h-14 w-[95%] max-w-md 
                   flex items-center justify-around px-4 z-50"
      >
        {tabs.map((tab) => {
          // aktif kalau path persis sama, atau kalau tab Settings dan path sekarang mulai dengan /app/settings
          const active =
            pathname === tab.href ||
            (tab.href === '/app/settings' &&
              (pathname.startsWith('/app/settings') || pathname === '/app/profile'))

          const Icon = tab.icon
          return (
            <Tooltip key={tab.href}>
              <TooltipTrigger asChild>
                <Link
                  href={tab.href}
                  className={cn(
                    'relative flex flex-col items-center justify-center w-16 sm:w-20 py-1',
                    active ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative flex items-center justify-center"
                  >
                    <Icon className="h-6 w-6" />
                    {typeof tab.badge == 'number' && tab.badge > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-3 px-1.5 py-0 text-[10px] rounded-full"
                      >
                        {tab.badge}
                      </Badge>
                    )}
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-2 h-1 w-6 rounded-full bg-primary"
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 25,
                          bounce: 0.35, // pantulan lebih terasa
                          duration: 0.5, // durasi singkat
                          ease: 'easeInOut',
                        }}
                      />
                    )}
                  </motion.div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top" className="hidden sm:block text-xs">
                {tab.label}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </motion.nav>
    </TooltipProvider>
  )
}
