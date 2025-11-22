'use client'

import { useAuth } from '@/context/AuthContext'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Checking session...</p>
      </div>
    )
  }

  if (!user) {
    return null // atau skeleton
  }

  return <>{children}</>
}
