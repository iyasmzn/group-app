// components/group/ChatShell.tsx
'use client'

import { ReactNode } from 'react'
import { GroupChatTopbar } from '@/components/app/groups/GroupChatToolbar'
import { useParams } from 'next/navigation'
import { useGroupData } from '@/lib/hooks/useGroupData'

export function ChatShell({ children, footer }: { children: ReactNode; footer: ReactNode }) {
  const params = useParams()
  const groupData = useGroupData(params?.groupId as string)

  return (
    <div className="flex flex-col min-h-screen">
      {params && params.groupId && groupData ? (
        <GroupChatTopbar
          groupId={params.groupId as string}
          name={groupData?.name || 'Group'}
          avatar={groupData?.image_url}
        />
      ) : null}
      <div className="flex-1 overflow-y-auto flex items-stretch">{children}</div>
      <div className="">{footer}</div>
    </div>
  )
}
