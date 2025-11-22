'use client'
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
import { useProfile } from '@/lib/hooks/useProfile'
import { useLastGroup } from '@/lib/hooks/useGroupData'

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
