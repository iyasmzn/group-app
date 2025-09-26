"use client"

import { createContext, useContext } from "react"
import { useUnreadCount } from "@/lib/hooks/useUnreadCount"
import { useEventBadge } from "@/lib/hooks/useEventBadge"
import { useFinanceBadge } from "@/lib/hooks/useFinanceBadge"
import { useAssetBadge } from "@/lib/hooks/useAssetBadge"
import { useCoopBadge } from "@/lib/hooks/useCoopBadge"

type BadgeContextType = {
  unread: number
  events: number
  finance: number
  assets: number
  coop: number
}

const GroupBadgeContext = createContext<BadgeContextType>({
  unread: 0,
  events: 0,
  finance: 0,
  assets: 0,
  coop: 0,
})

export function GroupBadgeProvider({ groupId, children }: { groupId: string; children: React.ReactNode }) {
  const unread = useUnreadCount(groupId)
  const events = useEventBadge(groupId)
  const finance = useFinanceBadge(groupId)
  const assets = useAssetBadge(groupId)
  const coop = useCoopBadge(groupId)

  return (
    <GroupBadgeContext.Provider value={{ unread, events, finance, assets, coop }}>
      {children}
    </GroupBadgeContext.Provider>
  )
}

export function useGroupBadges() {
  return useContext(GroupBadgeContext)
}