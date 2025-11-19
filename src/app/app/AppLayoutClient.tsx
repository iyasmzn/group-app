'use client'

import { usePathname } from 'next/navigation'
import { AppBottombar } from '@/components/app/bottombar'
import { AuthGuard } from './AuthGuard'
import { NotificationProvider } from '@/context/notification/NotificationProvider'

export function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const hiddenRoutes = ['/app/settings/profile', '/app/groups/']

  const hideBottomBar = hiddenRoutes.some((route) => pathname.startsWith(route))

  return (
    <AuthGuard>
      <NotificationProvider>
        {children}
        {!hideBottomBar && <AppBottombar />}
      </NotificationProvider>
    </AuthGuard>
  )
}
