'use client'
import LoadingOverlay from '@/components/loading-overlay'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Reveal from '@/components/animations/Reveal'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LucideUsers, MessageCircleWarning } from 'lucide-react'
import { useGroupBadges } from '@/context/GroupBadgeContext'
import ClockWidget from '@/components/app/groups/dashboard/ClockWidget'
import { DashboardStatCard } from '@/components/app/groups/dashboard/DashboardStatCard'

export default function GroupDashboardPage() {
  const router = useRouter()
  const [loading] = useState(false)
  const { unread, groupData } = useGroupBadges()

  return (
    <>
      <LoadingOverlay isLoading={loading} />
      <ScrollArea>
        <Reveal className="p-2 md:p-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">{groupData?.name}</CardTitle>
              <CardDescription>Group Dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {/* Clock */}
                <ClockWidget />

                {/* Total Member */}
                <DashboardStatCard
                  icon={LucideUsers}
                  value={groupData?.group_members?.length ?? 0}
                  label="Total Member"
                />

                {/* Unread Messages */}
                <DashboardStatCard
                  icon={MessageCircleWarning}
                  value={unread}
                  label="Unread Messages"
                  accent={unread ? 'animate-pulse text-primary' : 'text-muted-foreground'}
                  onClick={() => router.push('chat')}
                />
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </ScrollArea>
    </>
  )
}
