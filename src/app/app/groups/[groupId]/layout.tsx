import type { Metadata } from "next"
import { MotionProvider } from "@/components/providers"
import { GroupSeenClient } from "./components/group-seen-client"
import { GroupNavigation } from "@/components/group/GroupNavigation"
import GroupTopbar from "@/components/group/GroupTopbar"

// ✅ generateMetadata jalan di server, jadi bisa fetch langsung
export async function generateMetadata(
  { params }: { params: Promise<{ groupId: string }> }
): Promise<Metadata> {
  const { groupId } = await params

  // fetch data grup dari Supabase REST API
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/groups?id=eq.${groupId}&select=name`,
    {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      },
      cache: "no-store", // biar selalu fresh
    }
  )

  if (!res.ok) {
    return { title: "Group App" }
  }

  const data = await res.json()
  const group = data?.[0]

  return {
    title: group?.name ? `${group.name} – Group App` : "Group App",
    description: group?.name
      ? `Halaman grup ${group.name} di aplikasi Group App`
      : "Group App",
  }
}

// ✅ params sekarang Promise
export default async function GroupLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ groupId: string }>
}) {
  const { groupId } = await params   // ✅ tunggu promise

  return (
    <MotionProvider>
      <GroupTopbar />
      <GroupSeenClient groupId={groupId} />
      <div className="flex justify-center">
        <GroupNavigation />
        <main className="flex-1 max-w-4xl md:ml-56">
          {children}
        </main>
      </div>
    </MotionProvider>
  )
}