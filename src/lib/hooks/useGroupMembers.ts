"use client"

import { GroupMember, groupService } from "@/services/groupService/groupService"
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
    } catch (err: any) {
      console.error("Error fetching group members:", err)
      setError(err)
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