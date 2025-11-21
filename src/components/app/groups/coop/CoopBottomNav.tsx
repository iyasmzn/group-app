'use client'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Users, CreditCard, Settings, Undo2, ChartPie } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export function CoopBottomNav() {
  const pathname = usePathname()
  const { groupId } = useParams() as { groupId: string }
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    { href: `/app/groups/${groupId}`, label: 'Back', icon: Undo2 },
    { href: `/app/groups/${groupId}/coop`, label: 'Dashboard', icon: ChartPie },
    { href: `/app/groups/${groupId}/coop/loans`, label: 'Pinjaman', icon: CreditCard, badge: 2 }, // contoh badge
    { href: `/app/groups/${groupId}/coop/settings`, label: 'Pengaturan', icon: Settings },
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
        {navItems.map(({ href, label, icon: Icon, badge }) => {
          const active =
            pathname === href ||
            (href.includes('/settings') &&
              pathname.startsWith(`/app/groups/${groupId}/coop/settings`)) ||
            (href.includes('/loans') && pathname.startsWith(`/app/groups/${groupId}/coop/loans`))

          return (
            <Tooltip key={href}>
              <TooltipTrigger asChild>
                <Link
                  href={href}
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
                    {typeof badge === 'number' && badge > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-3 px-1.5 py-0 text-[10px] rounded-full"
                      >
                        {badge}
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
                          bounce: 0.35,
                          duration: 0.5,
                          ease: 'easeInOut',
                        }}
                      />
                    )}
                  </motion.div>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top" className="hidden sm:block text-xs">
                {label}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </motion.nav>
    </TooltipProvider>
  )
}
