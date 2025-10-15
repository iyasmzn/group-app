'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { AppAvatar } from '@/components/ui/app-avatar'
import Reveal from '@/components/animations/Reveal'
import { useAppBadges } from '@/context/AppBadgeContext'
import { ShineBorder } from '@/components/ui/shine-border'
import { AppBottombar } from '@/components/app/bottombar'
import { useRouter } from 'next/navigation'

export default function ProfileDetailPage() {
  const { profile, profileLoading, user } = useAppBadges()
  const router = useRouter()

  if (profileLoading) {
    return (
      <div className="max-w-lg mx-auto p-6 space-y-6">
        <Skeleton className="h-28 w-28 rounded-full mx-auto" />
        <Skeleton className="h-6 w-32 mx-auto" />
        <Skeleton className="h-4 w-40 mx-auto" />
      </div>
    )
  }

  return (
    <>
      <div className="max-w-lg mx-auto p-6 space-y-6">
        <Card className="overflow-hidden relative">
          <ShineBorder shineColor={['#A07CFE', '#FE8FB5', '#FFBE7B']} />
          <CardHeader className="flex flex-col items-center space-y-3">
            <Reveal animation="fadeInDown">
              <AppAvatar
                name={profile?.full_name || profile?.email || 'Guest'}
                image={profile?.avatar_url}
                size="xl"
                preview
              />
            </Reveal>
            <Reveal animation="fadeInUp">
              <CardTitle className="text-xl font-semibold">
                {profile?.full_name || 'Guest'}
              </CardTitle>
            </Reveal>
            <Reveal animation="fadeInUp" delay={0.1}>
              <p className="text-muted-foreground text-sm">{profile?.email}</p>
            </Reveal>
            {user?.created_at && (
              <Reveal animation="fadeInUp" delay={0.2}>
                <p className="text-secondary-foreground text-xs">
                  Joined{' '}
                  {new Date(user.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                  })}
                </p>
              </Reveal>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            <Reveal animation="fadeInUp" delay={0.3}>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Full Name</span>
                <span className="font-medium">{profile?.full_name || '-'}</span>
              </div>
            </Reveal>

            <Reveal animation="fadeInUp" delay={0.4}>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="font-medium">{profile?.email || '-'}</span>
              </div>
            </Reveal>

            <Reveal animation="fadeInUp" delay={0.6}>
              <Button className="w-full" onClick={() => router.push('/app/settings/profile')}>
                Edit Profile
              </Button>
            </Reveal>
          </CardContent>
        </Card>
      </div>
      <AppBottombar />
    </>
  )
}
