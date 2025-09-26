import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Setting | Group App",
  description: "Setting page of Group App",
}

export default function SettingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}