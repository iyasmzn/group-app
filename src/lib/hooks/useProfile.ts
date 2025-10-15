"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/supabase/auth"
import { supabase } from "@/lib/supabase/client"
import type { Profile } from "@/types/profile"
import { useRealtimeTable } from "./useRealtimeTable"

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // fetch profile pertama kali
  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (error) {
        setError(error.message)
        setProfile(null)
      } else {
        setProfile(data)
        setError(null)
      }
      setLoading(false)
    }

    fetchProfile()
  }, [user])

  // realtime subscribe pakai hook generik
  useRealtimeTable<Profile>({
    supabase,
    table: "profiles",
    filter: user ? `id=eq.${user.id}` : undefined,
    onUpdate: (newProfile) => setProfile(newProfile),
    onInsert: (newProfile) => setProfile(newProfile),
    onDelete: () => setProfile(null),
  })

  return { supabase, user, profile, loading, error }
}