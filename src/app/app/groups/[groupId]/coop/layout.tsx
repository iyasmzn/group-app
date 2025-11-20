'use client'

import { CoopBottomNav } from '@/components/app/groups/coop/CoopBottomNav'

export default function CoopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Content */}
      <main className="flex-1 pb-16 px-4">{children}</main>

      {/* Bottom Navigation */}
      <CoopBottomNav />
    </div>
  )
}
