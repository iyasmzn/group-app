import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Home | Group App",
  description: "Home page of Group App",
}

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}