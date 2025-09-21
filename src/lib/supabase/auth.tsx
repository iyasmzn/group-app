"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { supabase } from "@/lib/supabase/client"
import type { User, Session, SupabaseClient } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  supabase: SupabaseClient
  signUp: (email: string, password: string, name: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  updateUserMeta: (data: Record<string, any>) => Promise<void>
  updateProfile: (data: Record<string, any>) => Promise<void>
  updateProfileHybrid?: (data: { full_name?: string; avatar_url?: string }) => Promise<void>
  getProfile: () => Promise<any | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    }
    initAuth()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    listener?.subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({ 
      email, 
      password, 
      options: 
        { 
          data: { full_name: name }, 
          emailRedirectTo: `${window.location.origin}/login`
        } 
      })
    if (error) throw error
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    // tapi kalau mau langsung fetch juga bisa
    const { data: sessionData } = await supabase.auth.getSession()
    setSession(sessionData.session)
    setUser(sessionData.session?.user ?? null)
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    window.location.href = "/"
    setUser(null)
    setSession(null)
  }

  const updateUserMeta = async (data: Record<string, any>) => {
    const { error } = await supabase.auth.updateUser({ data })
    if (error) throw error

    const { data: sessionData } = await supabase.auth.getSession()
    setSession(sessionData.session)
    setUser(sessionData.session?.user ?? null)
  }

  const getProfile = async () => {
    if (!user) return null
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (error) throw error
    return data
  }

  const updateProfile = async (data: Record<string, any>) => {
    if (!user) throw new Error("Not logged in")
    const { error } = await supabase
      .from("profiles")
      .update(data)
      .eq("id", user.id)

    if (error) throw error

    // refresh user session juga
    const { data: sessionData } = await supabase.auth.getSession()
    setSession(sessionData.session)
    setUser(sessionData.session?.user ?? null)
  }

  const updateProfileHybrid = async (data: { full_name?: string; avatar_url?: string }) => {
    if (!user) throw new Error("Not logged in")

    const updates: any = {}
    if (data.full_name !== undefined) updates.full_name = data.full_name
    if (data.avatar_url !== undefined) updates.avatar_url = data.avatar_url

    // 1. Update ke profiles
    const { error: profileError } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)

    if (profileError) throw profileError

    // 2. Update ke auth.user.user_metadata
    const { error: metaError } = await supabase.auth.updateUser({
      data: {
        ...(data.full_name ? { full_name: data.full_name } : {}),
        ...(data.avatar_url !== undefined ? { avatar_url: data.avatar_url } : {}),
      },
    })

    if (metaError) throw metaError

    // refresh session biar data auth.user langsung terupdate
    const { data: sessionData } = await supabase.auth.getSession()
    setSession(sessionData.session)
    setUser(sessionData.session?.user ?? null)
  }



  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        supabase,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        updateUserMeta,
        updateProfile,
        getProfile,
        updateProfileHybrid,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used inside AuthProvider")
  return context
}