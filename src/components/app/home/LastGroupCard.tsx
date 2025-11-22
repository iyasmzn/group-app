'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, LucideIcon, MessageCircle, MessageCircleWarning, Store, SunDim } from 'lucide-react'
import { ShineBorder } from '@/components/ui/shine-border'
import CountUp from '@/components/ui/count-up'
import { AppAvatar } from '@/components/ui/app-avatar'
import { useNotifications } from '@/context/notification/NotificationContext'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import FeatureShortcuts from '@/components/ui/feature-shortcuts'

type LastGroup = {
  id: string
  name: string
  image_url?: string | null
  joinedate?: string | null
  last_seen_at?: string | null
}

export function LastGroupCard({ lastGroup }: { lastGroup: LastGroup }) {
  // ambil badge dari provider
  const { unread } = useNotifications()

  if (!lastGroup) return null

  const unreadCount = unread.chat[lastGroup.id] || 0

  const features = [
    {
      id: 'chat',
      title: 'Chat',
      icon: MessageCircle,
      href: `/app/groups/${lastGroup.id}/chat`,
    },
    {
      id: 'koperasi',
      title: 'Koperasi',
      icon: Store,
      href: `/app/groups/${lastGroup.id}/coop`,
    },
    {
      id: 'coming-soon',
      title: 'ComingSoon',
      icon: SunDim,
    },
  ]

  return (
    <Card className="relative overflow-hidden">
      <ShineBorder shineColor={['#A07CFE', '#FE8FB5', '#FFBE7B']} />
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center">
          <Link href={`groups/${lastGroup.id}`} className="flex items-center gap-2">
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
            {unreadCount > 0 ? (
              <MessageCircleWarning className="w-6 h-6 mb-2 text-primary animate-pulse" />
            ) : (
              <MessageCircle className="w-6 h-6 mb-2" />
            )}
            <CountUp
              from={0}
              to={unreadCount}
              separator=","
              direction="up"
              duration={1}
              className={`text-3xl font-bold ${unreadCount && 'text-primary animate-pulse'}`}
            />
            <span className="text-xs text-muted-foreground">Unread Messages</span>
          </Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          <FeatureShortcuts items={features} />
        </div>
      </CardContent>
    </Card>
  )
}
