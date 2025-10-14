"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/supabase/auth"
import PageWrapper from "@/components/page-wrapper"
import Reveal from "@/components/animations/Reveal"
import { AppBottombar } from "@/components/app/bottombar"
import { toast } from "sonner"
import { GroupBadgeProvider } from "@/context/GroupBadgeContext"
import { LastGroupCard } from "@/components/app/home/LastGroupCard"
import { GroupAvatar } from "@/components/group-avatar"
import { ClockFading } from "lucide-react"

type LastGroup = {
  id: string
  name: string
  image_url?: string
  message_last_seen_at: string
  last_seen_at: string
  unreadCount: number
  joinedate: string
}

export default function UserHomePage() {
  const { supabase, user } = useAuth()
  const router = useRouter()
  const [lastGroup, setLastGroup] = useState<LastGroup | null>(null)

  useEffect(() => {
    if (!user) {
      toast.error('Please Login.')
      router.push("/login")
      return
    }


    fetchLastGroup()
  }, [user, supabase, router])

  const fetchLastGroup = async () => {
    if (!user) {
      toast.error('Please Login.')
      router.push("/login")
      return
    }
    // coba ambil group terakhir dibuka
    const { data: groups } = await supabase
      .from("groups")
      .select(`
        *,
        group_members!inner(*),
        group_last_seen(last_seen_at, message_last_seen_at)
      `)
      .eq("group_members.user_id", user.id)
      .eq("group_last_seen.user_id", user.id)
      .order("last_seen_at", { referencedTable: "group_last_seen", ascending: false })
      .limit(1)

    let g = groups?.[0]

    // kalau belum ada last_seen, fallback ke group terbaru yang di-join
    if (!g || !g.group_last_seen?.length) {
      const { data: fallbackGroups } = await supabase
        .from("groups")
        .select(`
          *,
          group_members!inner(joinedat)
        `)
        .eq("group_members.user_id", user.id)
        .order("joinedat", { referencedTable: "group_members", ascending: false })
        .limit(1)

      g = fallbackGroups?.[0]
    }

    if (g) {
      const lastSeenAt = g.group_last_seen?.[0]?.message_last_seen_at || null
      console.log('g',g)
      const queryCount = supabase
        .from("group_messages")
        .select("id", { count: "exact", head: true })
        .eq("group_id", g.id)
        .neq("sender_id", user.id)

      if (lastSeenAt)
        queryCount.gt("createdat", lastSeenAt)
      
      const { count } = await queryCount

      setLastGroup({
        id: g.id,
        name: g.name,
        image_url: g.image_url,
        last_seen_at: g.group_last_seen?.[0]?.last_seen_at || null,
        message_last_seen_at: lastSeenAt,
        unreadCount: count || 0,
        joinedate: g.group_members[0].joinedat
      })
    }
  }

  if (!user) return null

  return (
    <>
      <AppBottombar />
      <PageWrapper>
        <div className="p-4 max-w-4xl mx-auto space-y-6">
          <Reveal>
            <h1 className="text-2xl font-bold">Hello, {user.user_metadata.full_name || user.email}!</h1>
            <GroupAvatar image={user.user_metadata.avatar_url} name={user.user_metadata.full_name} />
          </Reveal>

          {lastGroup && (
            <GroupBadgeProvider groupId={lastGroup.id}>
              <h4>
                <ClockFading className="inline-block mr-2" />
                Last Group Activity
              </h4>
              <LastGroupCard lastGroup={lastGroup} />
            </GroupBadgeProvider>
          )}
        </div>
      </PageWrapper>
    </>
  )
}