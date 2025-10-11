"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"

type GroupRole = {
  code: string
  name: string
  permissions?: string // Optional, depending on your schema
}

export function useGroupRole(groupId: string) {
  const [role, setRole] = useState<GroupRole | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchRole = async () => {
      try {
        setLoading(true)
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()
        if (userError) throw userError
        if (!user) throw new Error("User not logged in")

        const { data, error } = await supabase
          .from("group_members")
          .select("role:group_roles(code, name, permissions)")
          .eq("group_id", groupId)
          .eq("user_id", user.id)
          .maybeSingle()

        if (error) throw error

        if (data) {
          const role = Array.isArray(data.role) ? data.role[0] : data.role
          setRole(role ?? null)
        } else {
          setRole(null)
        }
      } catch (err: unknown) {
        const e = err instanceof Error ? err : new Error("Unknown error")
        console.error("Error fetching group role:", e)
        setError(e)
      } finally {
        setLoading(false)
      }
    }

    if (groupId) fetchRole()
  }, [groupId])

  return { role, loading, error }
}