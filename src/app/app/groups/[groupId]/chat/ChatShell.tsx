// components/group/ChatShell.tsx
"use client"

import { ReactNode } from "react"

export function ChatShell({ children, footer }: { children: ReactNode; footer: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 overflow-y-auto">{children}</div>
      <div className="border-t bg-background p-2">{footer}</div>
    </div>
  )
}