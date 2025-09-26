"use client"
import LoadingOverlay from "@/components/loading-overlay";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Reveal from "@/components/animations/Reveal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LucideUsers, MessageCircleWarning } from "lucide-react";
import { useUnreadCount } from "@/lib/hooks/useUnreadCount";
import { useGroupData } from "@/lib/hooks/useGroupData";
import ClockWidget from "@/components/group/dashboard/ClockWidget";

export default function GroupDashboardPage() {
  const params = useParams();
  const groupId = params?.groupId as string
  const [loading] = useState(false);
  const groupData = useGroupData(groupId)
  const unreadCount = useUnreadCount(groupId)

  return (
    <Reveal className="p-2 md:p-6">
      <LoadingOverlay isLoading={loading} />
      <ScrollArea>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">{groupData?.name}</CardTitle>
              <CardDescription>Group Dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {/* Waktu sekarang */}
                <ClockWidget />

                {/* Total Member */}
                <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted">
                  <LucideUsers className="w-6 h-6 mb-2 text-primary" />
                  <span className="text-3xl font-bold text-primary">{groupData?.group_members?.length}</span>
                  <span className="text-xs text-muted-foreground">Total Member</span>
                </div>

                {/* Unread Messages */}
                <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted">
                  <MessageCircleWarning className="w-6 h-6 mb-2 text-primary" />
                  <span className="text-3xl font-bold text-primary">{unreadCount}</span>
                  <span className="text-xs text-muted-foreground">Unread Messages</span>
                </div>
              </div>
            </CardContent>
          </Card>
      </ScrollArea>
    </Reveal>
  )
}