// app/app/groups/[groupId]/chat/layout.tsx
"use client"

import GroupTopbar from "@/components/group/GroupTopbar"
import { ReactNode } from "react"

export default function ChatLayout({
  children, footer
}: {
  children: ReactNode,
  footer: ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Area chat scrollable */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>

      {/* Chat input fixed di bawah */}
      <div className="border-t bg-background p-2">
        {footer}
      </div>
    </div>
  )
}