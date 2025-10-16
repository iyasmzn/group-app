'use client'

import { createContext, useContext } from 'react'
import { useAppBadges } from './AppBadgeContext'

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

export function GroupBadgeProvider({
  groupId,
  children,
}: {
  groupId: string
  children: React.ReactNode
}) {
  const { groupUnreadMap } = useAppBadges()
  const unread = groupUnreadMap[groupId] ?? 0

  // fitur lain belum ready → default 0
  const events = 0
  const finance = 0
  const assets = 0
  const coop = 0

  return (
    <GroupBadgeContext.Provider value={{ unread, events, finance, assets, coop }}>
      {children}
    </GroupBadgeContext.Provider>
  )
}

export function useGroupBadges() {
  return useContext(GroupBadgeContext)
}
