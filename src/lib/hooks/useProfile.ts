'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/lib/supabase/auth'
import { supabase } from '@/lib/supabase/client'
import type { Profile } from '@/types/profile'
import { useRealtime } from './useRealtime'

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const filter = user?.id ? `id=eq.${user.id}` : undefined

  // fetch profile pertama kali
  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      setLoading(true)
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()

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

  const handleUpdate = useCallback((newProfile: Profile) => setProfile(newProfile), [])
  const handleInsert = useCallback((newProfile: Profile) => setProfile(newProfile), [])
  const handleDelete = useCallback(() => setProfile(null), [])

  // realtime subscribe pakai hook generik
  useRealtime<Profile>({
    supabase,
    type: 'postgres_changes',
    table: 'profiles',
    filter,
    onUpdate: handleUpdate,
    onInsert: handleInsert,
    onDelete: handleDelete,
  })

  return { supabase, user, profile, loading, error }
}
