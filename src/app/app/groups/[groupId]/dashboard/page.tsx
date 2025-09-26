"use client"
import LoadingOverlay from "@/components/loading-overlay"
import { useParams } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Reveal from "@/components/animations/Reveal"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LucideUsers, MessageCircleWarning } from "lucide-react"
import { useUnreadCount } from "@/lib/hooks/useUnreadCount"
import { useGroupData } from "@/lib/hooks/useGroupData"
import ClockWidget from "@/components/group/dashboard/ClockWidget"
import { DashboardStatCard } from "@/components/group/dashboard/DashboardStatCard"

export default function GroupDashboardPage() {
  const params = useParams()
  const groupId = params?.groupId as string
  const [loading] = useState(false)

  const groupData = useGroupData(groupId)
  const unreadCount = useUnreadCount(groupId)

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
                  value={unreadCount}
                  label="Unread Messages"
                />
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </ScrollArea>
    </>
  )
}