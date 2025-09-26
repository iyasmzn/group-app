"use client"

import { useGroupSeen } from "@/lib/hooks/useGroupSeen"

export function GroupSeenClient({ groupId }: { groupId: string }) {
  useGroupSeen(groupId)
  return null
}