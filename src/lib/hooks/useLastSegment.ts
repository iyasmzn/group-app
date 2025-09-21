import { usePathname } from "next/navigation"

export function useLastSegment() {
  const pathname = usePathname() // contoh: "/app/groups/1f5c52e4-b0ba-4d2c-bac6-45c1726639b7/dashboard"
  const segments = pathname.split("/").filter(Boolean)
  return segments[segments.length - 1] // hasil: "dashboard"
}
