"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { supabase } from "@/lib/supabase/client"
import type { User, Session, SupabaseClient } from "@supabase/supabase-js"
import { Profile } from "@/types/profile"

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  supabase: SupabaseClient
  signUp: (email: string, password: string, name: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  updateUserMeta: (data: Partial<User["user_metadata"]>) => Promise<void>
  updateProfile: (data: Partial<Omit<Profile, "id">>) => Promise<void>
  updateProfileHybrid?: (data: { full_name?: string; avatar_url?: string }) => Promise<void>
  getProfile: () => Promise<Profile | null>
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

    return () => {
      listener?.subscription.unsubscribe()
    }
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
    if (error) throw new Error(error.message)
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
    // tapi kalau mau langsung fetch juga bisa
    refreshSession()
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) throw new Error(error.message)
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
    window.location.href = "/"
    setUser(null)
    setSession(null)
  }

  const updateUserMeta = async (data: Record<string, Partial<User["user_metadata"]>>) => {
    const { error } = await supabase.auth.updateUser({ data })
    if (error) throw new Error(error.message)
    
    refreshSession()
  }

  const getProfile = async () => {
    if (!user) return null
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  const updateProfile = async (data: Partial<Omit<Profile, "id">>) => {
    if (!user) throw new Error("Not logged in")
    const { error } = await supabase
      .from("profiles")
      .update(data)
      .eq("id", user.id)

    if (error) throw new Error(error.message)

    // refresh user session juga
    refreshSession()
  }

  const updateProfileHybrid = async (data: { full_name?: string; avatar_url?: string }) => {
    if (!user) throw new Error("Not logged in")

    const updates: Partial<Pick<Profile, "full_name" | "avatar_url">> = {}
    if (data.full_name !== undefined) updates.full_name = data.full_name
    if (data.avatar_url !== undefined) updates.avatar_url = data.avatar_url

    // 1. Update ke profiles
    const { error: profileError } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id)

    if (profileError) throw new Error(profileError.message)

    // 2. Update ke auth.user.user_metadata
    const { error: metaError } = await supabase.auth.updateUser({
      data: {
        ...(data.full_name ? { full_name: data.full_name } : {}),
        ...(data.avatar_url !== undefined ? { avatar_url: data.avatar_url } : {}),
      },
    })

    if (metaError) throw new Error(metaError.message)

    // refresh session biar data auth.user langsung terupdate
    refreshSession()
  }

  const refreshSession = async () => {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw new Error(error.message)
    setSession(data.session)
    setUser(data.session?.user ?? null)
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