'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { authService } from '@/services/authService'
import { supabase } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: typeof authService.signUp
  signIn: typeof authService.signIn
  signInWithGoogle: typeof authService.signInWithGoogle
  signOut: typeof authService.signOut
  updateUserMeta: typeof authService.updateUserMeta
  getProfile: (userId: string) => Promise<any>
  updateProfile: (userId: string, data: any) => Promise<void>
  updateProfileHybrid: (userId: string, data: any) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({
  children,
  initialSession,
}: {
  children: ReactNode
  initialSession?: Session | null
}) {
  const [session, setSession] = useState<Session | null>(initialSession ?? null)
  const [user, setUser] = useState<User | null>(initialSession?.user ?? null)
  const [loading, setLoading] = useState(!initialSession)

  useEffect(() => {
    let isMounted = true

    const initSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!isMounted) return

      setSession(data.session)
      setUser(data.session?.user ?? null)

      // 🔒 Validasi ke server Supabase Auth (secure)
      const { data: authUser } = await supabase.auth.getUser()
      if (!isMounted) return

      setUser(authUser.user ?? null)
      setLoading(false)
    }

    initSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return

      setSession(session)
      setUser(session?.user ?? null) // cukup set cepat, tidak wajib getUser()

      setLoading(false)
    })

    return () => {
      isMounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        ...authService,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
