// components/group/ChatShell.tsx
"use client"

import { ReactNode } from "react"
import { GroupChatTopbar } from "@/components/app/groups/GroupChatToolbar";
import { useParams } from "next/navigation";
import { useGroupData } from "@/lib/hooks/useGroupData";

export function ChatShell({ children, footer }: { children: ReactNode; footer: ReactNode }) {
  const params = useParams();
  const groupData = useGroupData(params?.groupId as string)

  return (
    <div className="flex flex-col min-h-screen">
      <GroupChatTopbar name={groupData?.name || 'Group'} avatar={groupData?.image_url} />
      <div className="flex-1 overflow-y-auto">{children}</div>
      <div className="border-t bg-background p-2">{footer}</div>
    </div>
  )
}