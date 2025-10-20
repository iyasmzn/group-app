'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, MessageCircle, MessageCircleWarning } from 'lucide-react'
import { useGroupBadges } from '@/context/GroupBadgeContext'
import { ShineBorder } from '@/components/ui/shine-border'
import { useTheme } from 'next-themes'
import CountUp from '@/components/ui/count-up'
import { AppAvatar } from '@/components/ui/app-avatar'

type LastGroup = {
  id: string
  name: string
  image_url?: string | null
  joinedate?: string | null
  last_seen_at?: string | null
}

export function LastGroupCard({ lastGroup }: { lastGroup: LastGroup }) {
  // ambil badge dari provider
  const { unread } = useGroupBadges()
  const theme = useTheme()

  if (!lastGroup) return null

  return (
    <Card className="relative overflow-hidden">
      <ShineBorder shineColor={['#A07CFE', '#FE8FB5', '#FFBE7B']} />
      <CardContent>
        <div className="flex flex-row justify-between items-center">
          <Link href={`groups/${lastGroup.id}`} className="flex items-center gap-2 mb-4">
            <AppAvatar name={lastGroup.name} image={lastGroup.image_url ?? undefined} size="lg" />
            <div>
              <p>{lastGroup.name}</p>
              <p className="text-xs text-muted-foreground">
                Joined:
                <span className="ml-1">
                  {lastGroup.joinedate
                    ? new Date(lastGroup.joinedate).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '-'}
                </span>
              </p>
            </div>
          </Link>
          <Button asChild variant="outline">
            <Link href={`groups/${lastGroup.id}`}>Show</Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Last seen */}
          <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted">
            <Clock className="w-6 h-6 mb-2 text-primary" />
            <span className="text-sm text-muted-foreground">Last seen</span>
            <span className="text-sm font-semibold">
              {lastGroup.last_seen_at
                ? new Date(lastGroup.last_seen_at).toLocaleString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: 'numeric',
                    month: 'short',
                  })
                : '-'}
            </span>
          </div>

          {/* Unread messages */}
          <Link
            href={`groups/${lastGroup.id}/chat`}
            className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted"
          >
            {unread > 0 ? (
              <MessageCircleWarning className="w-6 h-6 mb-2 text-primary animate-pulse" />
            ) : (
              <MessageCircle className="w-6 h-6 mb-2" />
            )}
            <CountUp
              from={0}
              to={unread}
              separator=","
              direction="up"
              duration={1}
              className={`text-3xl font-bold ${unread && 'text-primary animate-pulse'}`}
            />
            <span className="text-xs text-muted-foreground">Unread Messages</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
