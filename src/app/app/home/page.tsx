"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/supabase/auth"
import PageWrapper from "@/components/page-wrapper"
import Reveal from "@/components/animations/Reveal"
import { AppBottombar } from "@/components/app/bottombar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Clock, Mail } from "lucide-react"
import { GroupAvatar } from "@/components/group-avatar"
import Link from "next/link"

type LastGroup = {
  id: string
  name: string
  image_url?: string
  last_seen_at: string
  unreadCount: number
  joinedate: Date
}

export default function UserHomePage() {
  const { supabase, user } = useAuth()
  const router = useRouter()
  const [lastGroup, setLastGroup] = useState<LastGroup | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const fetchLastGroup = async () => {
      // coba ambil group terakhir dibuka
      const { data: groups, error } = await supabase
        .from("groups")
        .select(`
          *,
          group_members!inner(*),
          group_last_seen(last_seen_at)
        `)
        .eq("group_members.user_id", user.id)
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
        const lastSeenAt = g.group_last_seen?.[0]?.last_seen_at || null
        console.log('g',g)
        const queryCount = supabase
          .from("group_messages")
          .select("id", { count: "exact", head: true })
          .eq("group_id", g.id)

        if (lastSeenAt)
          queryCount.gt("createdat", lastSeenAt)
        
        const { count } = await queryCount

        setLastGroup({
          id: g.id,
          name: g.name,
          image_url: g.image_url,
          last_seen_at: lastSeenAt,
          unreadCount: count || 0,
          joinedate: g.group_members[0].joinedat
        })
      }
    }


    fetchLastGroup()
  }, [user, supabase, router])

  if (!user) return null

  return (
    <>
      <AppBottombar />
      <PageWrapper>
        <div className="p-4 max-w-4xl mx-auto space-y-6">
          <Reveal>
            <h1 className="text-2xl font-bold">Hello, {user.user_metadata.full_name || user.email}!</h1>
          </Reveal>

          {lastGroup && (
            <Reveal delay={0.2}>
              <Card>
                <CardHeader>
                  <CardTitle>Last Group</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href={`groups/${lastGroup.id}`} className="flex items-center gap-2 mb-4">
                    <GroupAvatar 
                      name={lastGroup.name} 
                      image={lastGroup.image_url} // kalau ada, tampil gambar
                      size="lg" 
                    />
                    <div>
                      <p>{ lastGroup.name }</p>
                      <p className="text-xs text-muted-foreground">
                        Joined: 
                        <span className="ml-1">
                          { lastGroup.joinedate ? new Date(lastGroup.joinedate).toLocaleString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: 'numeric'
                          }) : '-' }
                        </span>
                      </p>
                    </div>
                  </Link>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Last seen */}
                    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted">
                      <Clock className="w-6 h-6 mb-2 text-primary" />
                      <span className="text-sm text-muted-foreground">Last seen</span>
                      <span className="text-sm font-semibold">
                        {lastGroup.last_seen_at ? new Date(lastGroup.last_seen_at).toLocaleString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "numeric",
                          month: "short",
                        }) : '-'}
                      </span>
                    </div>

                    {/* Unread messages */}
                    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted">
                      <Mail className="w-6 h-6 mb-2 text-primary" />
                      <span className="text-3xl font-bold text-primary">{lastGroup.unreadCount}</span>
                      <span className="text-xs text-muted-foreground">Unread Messages</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          )}
        </div>
      </PageWrapper>
    </>
  )
}