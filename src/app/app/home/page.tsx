'use client'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PageWrapper from '@/components/page-wrapper'
import Reveal from '@/components/animations/Reveal'
import { GroupBadgeProvider } from '@/context/GroupBadgeContext'
import { LastGroupCard } from '@/components/app/home/LastGroupCard'
import { ClockFading } from 'lucide-react'
import { ProfileSkeleton } from '@/components/ui/profile-skeleton'
import { LastGroupSkeleton } from '@/components/app/home/LastGroupSkeleton'
import { AppAvatar } from '@/components/ui/app-avatar'
import { EmptyGroupCard } from '@/components/app/home/EmptyGroupCard'
import { useNotifications } from '@/context/notification/NotificationContext'
import { useProfile } from '@/lib/hooks/useProfile'
import { supabase } from '@/lib/supabase/client'

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
  const { user, profile, loading } = useProfile()
  const router = useRouter()
  const [lastGroup, setLastGroup] = useState<LastGroup | null>(null)
  const [loadingGroup, setLoadingGroup] = useState(true)
  const { unread } = useNotifications()

  useEffect(() => {
    if (user) {
      fetchLastGroup()
    }
  }, [user?.id])

  const fetchLastGroup = useCallback(async () => {
    if (!user?.id) return

    console.log('Fetching last group for user:', user.id)

    setLoadingGroup(true)
    // coba ambil group terakhir dibuka
    const { data: groups } = await supabase
      .from('groups')
      .select(
        `
        *,
        group_members!inner(*),
        group_last_seen(last_seen_at, message_last_seen_at)
      `
      )
      .eq('group_members.user_id', user.id)
      .eq('group_last_seen.user_id', user.id)
      .order('last_seen_at', { referencedTable: 'group_last_seen', ascending: false })
      .limit(1)
    console.log('Fetched groups:', groups)
    let g = groups?.[0]

    // kalau belum ada last_seen, fallback ke group terbaru yang di-join
    if (!g || !g.group_last_seen?.length) {
      const { data: fallbackGroups } = await supabase
        .from('groups')
        .select(
          `
          *,
          group_members!inner(joinedat)
        `
        )
        .eq('group_members.user_id', user.id)
        .order('joinedat', { referencedTable: 'group_members', ascending: false })
        .limit(1)

      g = fallbackGroups?.[0]
    }

    if (g) {
      const lastSeenAt = g.group_last_seen?.[0]?.message_last_seen_at || null
      console.log('unread.chat', unread.chat)
      const unreadCount = unread.chat[g.id] ?? 0
      console.log('Last group found:', g.id, 'with unread count:', unreadCount)

      setLastGroup({
        id: g.id,
        name: g.name,
        image_url: g.image_url,
        last_seen_at: g.group_last_seen?.[0]?.last_seen_at || null,
        message_last_seen_at: lastSeenAt,
        unreadCount: unreadCount,
        joinedate: g.group_members[0].joinedat,
      })
    }
    setLoadingGroup(false)
  }, [user?.id, unread])

  return (
    <>
      <PageWrapper>
        <div className="p-4 max-w-4xl mx-auto space-y-6">
          <Reveal className="flex items-center gap-4" animation="fadeInDown">
            {loading || !profile ? (
              <ProfileSkeleton />
            ) : (
              <>
                <AppAvatar
                  size="xl"
                  image={profile.avatar_url}
                  name={profile.full_name || 'No Name'}
                  hoverAction={{ onClick: () => router.push('/app/profile') }}
                  preview
                />
                <div>
                  <h3 className="text-xl text-secondary-foreground">Welcome,</h3>
                  <h3 className="text-2xl font-bold">{profile.full_name || profile.email}!</h3>
                </div>
              </>
            )}
          </Reveal>

          <Reveal>
            <h4>
              <ClockFading className="inline-block mr-2" />
              Last Group Activity
            </h4>
          </Reveal>

          <Reveal delay={0.1}>
            {loadingGroup ? (
              <LastGroupSkeleton />
            ) : (
              lastGroup && (
                <GroupBadgeProvider groupId={lastGroup.id}>
                  <LastGroupCard lastGroup={lastGroup} />
                </GroupBadgeProvider>
              )
            )}
            {!loadingGroup && !lastGroup && <EmptyGroupCard />}
          </Reveal>
        </div>
      </PageWrapper>
    </>
  )
}
