'use client'

import { CoopBottomNav } from '@/components/app/groups/coop/CoopBottomNav'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function CoopLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ groupId: string }>
}) {
  const { groupId } = React.use(params) // ✅ unwrap promise
  const pathname = usePathname()

  const hiddenRoutes = [`/app/groups/${groupId}/coop/loans/`]
  const hideBottomNav = hiddenRoutes.some((route) => pathname?.startsWith(route))

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-16 px-4">{children}</main>
      {!hideBottomNav && <CoopBottomNav />}
    </div>
  )
}
