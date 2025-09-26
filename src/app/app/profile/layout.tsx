import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Profile | Group App",
  description: "Profile page of Group App",
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}