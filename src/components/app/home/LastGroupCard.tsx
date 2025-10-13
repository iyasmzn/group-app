"use client"

import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, MessageCircle, MessageCircleQuestion } from "lucide-react"
import { GroupAvatar } from "@/components/group-avatar"
import { useGroupBadges } from "@/context/GroupBadgeContext"
import Reveal from "@/components/animations/Reveal"

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

  if (!lastGroup) return null

  return (
    <Reveal delay={0.2}>
      <Card>
        <CardHeader>
          <CardTitle>Last Group</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row justify-between items-center">
            <Link
              href={`groups/${lastGroup.id}`}
              className="flex items-center gap-2 mb-4"
            >
              <GroupAvatar
                name={lastGroup.name}
                image={lastGroup.image_url ?? undefined}
                size="lg"
              />
              <div>
                <p>{lastGroup.name}</p>
                <p className="text-xs text-muted-foreground">
                  Joined:
                  <span className="ml-1">
                    {lastGroup.joinedate
                      ? new Date(lastGroup.joinedate).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
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
                  ? new Date(lastGroup.last_seen_at).toLocaleString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "numeric",
                      month: "short",
                    })
                  : "-"}
              </span>
            </div>

            {/* Unread messages */}
            <Link
              href={`groups/${lastGroup.id}/chat`}
              className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted"
            >
              {unread > 0 ? (
                <MessageCircleQuestion className="w-6 h-6 mb-2 text-primary" />
              ) : (
                <MessageCircle className="w-6 h-6 mb-2 text-primary" />
              )}
              <span className="text-3xl font-bold text-primary">{unread}</span>
              <span className="text-xs text-muted-foreground">
                Unread Messages
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </Reveal>
  )
}