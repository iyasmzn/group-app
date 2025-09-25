"use client"
import LoadingOverlay from "@/components/loading-overlay";
import { useAuth } from "@/lib/supabase/auth";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Reveal from "@/components/animations/Reveal";
import GroupTopbar from "../components/group-topbar";
import { GroupBottombar } from "../components/group-bottombar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GroupData } from "@/types/group";
import { Clock, LucideUsers, Mail, MessageCircleWarning } from "lucide-react";

export default function GroupDashboardPage() {
  const {supabase} = useAuth()
  const params = useParams();
  const groupId = params?.groupId;
  const [loading, setLoading] = useState(true);
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000) // update tiap menit
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setLoading(true);
    // Fetch group details to verify access
    const fetchGroupDetails = async () => {
      if (groupId) {
        const { data, error } = await supabase
          .from("groups")
          .select("*, group_members(*)")
          .eq("id", groupId)
          .single();
        
        if (error) {
          toast.error("Failed to load group details");
          console.error("Error fetching group details:", error);
          redirect("/app/groups");
        } else if (data) {  
          setGroupData(data)

          // ambil last_seen_at user
          const { data: lastSeen } = await supabase
            .from("group_last_seen")
            .select("last_seen_at")
            .eq("user_id", (await supabase.auth.getUser()).data?.user?.id)
            .eq("group_id", groupId)
            .single()

          const lastSeenAt = lastSeen?.last_seen_at || null

          // hitung pesan belum terbaca
          const unreadQuery = supabase
            .from("group_messages")
            .select("id", { count: "exact", head: true })
            .eq("group_id", groupId)
            
          if (lastSeenAt) 
            unreadQuery.gt("createdat", lastSeenAt)

          const { count } = await unreadQuery 

          setUnreadCount(count || 0)
        }
      }
    };

    fetchGroupDetails().finally(() => setLoading(false));
  }, [groupId, supabase]);

  return (
    <>
      <LoadingOverlay isLoading={loading} />
      <GroupTopbar />
      <ScrollArea>
        <Reveal>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">{groupData?.name}</CardTitle>
              <CardDescription>Group Dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {/* Waktu sekarang */}
                <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted">
                  <Clock className="w-6 h-6 mb-2 text-primary" />
                  <span className="text-lg font-semibold">
                    {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: '2-digit' })}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {now.toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

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
        </Reveal>
      </ScrollArea>
      <GroupBottombar />
    </>
  )
}