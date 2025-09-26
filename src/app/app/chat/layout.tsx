import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chat | Group App",
  description: "Chat page of Group App",
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}