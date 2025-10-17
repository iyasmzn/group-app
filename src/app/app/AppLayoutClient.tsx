'use client'

import { usePathname } from 'next/navigation'
import { AppBottombar } from '@/components/app/bottombar'
import { AppBadgeProvider } from '@/context/AppBadgeContext'
import { AuthGuard } from './AuthGuard'

export function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const hiddenRoutes = ['/app/settings/profile', '/app/groups/']

  const hideBottomBar = hiddenRoutes.some((route) => pathname.startsWith(route))

  return (
    <AuthGuard>
      <AppBadgeProvider>
        {children}
        {!hideBottomBar && <AppBottombar />}
      </AppBadgeProvider>
    </AuthGuard>
  )
}
