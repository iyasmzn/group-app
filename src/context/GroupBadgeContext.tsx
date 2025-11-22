'use client'

import { createContext, useContext } from 'react'
import { useNotifications } from '@/context/notification/NotificationContext'
import { useGroupData } from '@/lib/hooks/useGroupData'
import { GroupData } from '@/types/group.type'

type GroupBadgeContextType = {
  chat: number
  coop: number
  finance: number
  approval: number
  total: number
  groupData: GroupData | null
}

const GroupBadgeContext = createContext<GroupBadgeContextType>({
  chat: 0,
  coop: 0,
  finance: 0,
  approval: 0,
  total: 0,
  groupData: null,
})

export function GroupBadgeProvider({
  groupId,
  children,
}: {
  groupId: string
  children: React.ReactNode
}) {
  const { unread } = useNotifications()

  const chat = unread.chat[groupId] ?? 0
  const coop = unread.coop[groupId] ?? 0
  const finance = unread.finance[groupId] ?? 0
  const approval = unread.approval[groupId] ?? 0

  const total = chat + coop + finance + approval

  const groupData = useGroupData(groupId)

  return (
    <GroupBadgeContext.Provider value={{ chat, coop, finance, approval, total, groupData }}>
      {children}
    </GroupBadgeContext.Provider>
  )
}

export function useGroupBadges() {
  return useContext(GroupBadgeContext)
}
