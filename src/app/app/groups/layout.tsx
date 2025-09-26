import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Groups | Group App",
  description: "Groups page of Group App",
}

export default function GroupsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}