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
import { useLastGroup } from '@/lib/hooks/useGroupData'

type LastGroupState = {
  id: string
  name: string
  image_url: string | null
  last_seen_at: string | null
  message_last_seen_at: string | null
  unreadCount: number
  joinedate: string | null
}

// Define a type for the group data that makes group_last_seen optional
type GroupWithOptionalLastSeen = {
  createdat: string | null
  description: string | null
  description_updatedat: string | null
  description_updatedby: string | null
  id: string
  image_url: string | null
  name: string
  owner_id: string | null
  group_members: any[] // Adjust this to match your actual group_members type if needed
  group_last_seen?: { last_seen_at: string | null; message_last_seen_at: string | null }[] // Optional
}

export default function UserHomePage() {
  const { user, profile, loading } = useProfile()
  const { lastGroup, loading: loadingGroup } = useLastGroup(user?.id)
  const router = useRouter()

  // helper render profile
  const renderProfile = () =>
    loading || !profile ? (
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
    )

  return (
    <PageWrapper>
      <div className="p-4 max-w-4xl mx-auto space-y-6">
        <Reveal className="flex items-center gap-4" animation="fadeInDown">
          {renderProfile()}
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
          ) : lastGroup ? (
            <GroupBadgeProvider groupId={lastGroup.id}>
              <LastGroupCard lastGroup={lastGroup} />
            </GroupBadgeProvider>
          ) : (
            <EmptyGroupCard />
          )}
        </Reveal>
      </div>
    </PageWrapper>
  )
}
