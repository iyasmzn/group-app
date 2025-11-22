"use client"

import { groupService } from "@/services/groupService/groupService"
import { GroupMember } from "@/types/group.type"
import { useEffect, useState, useCallback } from "react"

export function useGroupMembers(groupId: string) {
  const [members, setMembers] = useState<GroupMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true)
      const data = await groupService.getMembers(groupId)
      setMembers(data)
      setError(null)
    } catch (err: unknown) {
      const e = err instanceof Error ? err : new Error("Unknown error")
      console.error("Error fetching group members:", e)
      setError(e)
    } finally {
      setLoading(false)
    }
  }, [groupId])

  useEffect(() => {
    if (groupId) {
      fetchMembers()
    }
  }, [groupId, fetchMembers])

  return { members, loading, error, refetch: fetchMembers }
}