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
  const [user, setUser] = useState<User | null>(initialSession?.user ?? null)
  const [session, setSession] = useState<Session | null>(initialSession ?? null)
  const [loading, setLoading] = useState(!initialSession)

  useEffect(() => {
    // initial session
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session)

      // isi user cepat dari session (fallback)
      setUser(data.session?.user ?? null)

      // verifikasi user ke server
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (!error) setUser(user ?? null)

      setLoading(false)
    })

    // subscribe to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)

      // isi user cepat dari session (fallback)
      setUser(session?.user ?? null)

      // verifikasi user ke server
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (!error) setUser(user ?? null)

      setLoading(false)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp: authService.signUp,
        signIn: authService.signIn,
        signInWithGoogle: authService.signInWithGoogle,
        signOut: authService.signOut,
        updateUserMeta: authService.updateUserMeta,
        getProfile: authService.getProfile,
        updateProfile: authService.updateProfile,
        updateProfileHybrid: authService.updateProfileHybrid,
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
