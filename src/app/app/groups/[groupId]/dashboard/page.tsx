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

export default function GroupDashboardPage() {
  const {supabase} = useAuth()
  const params = useParams();
  const groupId = params?.groupId;
  const [loading, setLoading] = useState(true);
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  console.log("Group ID:", groupId);
  
  useEffect(() => {
    setLoading(true);
    // Fetch group details to verify access
    const fetchGroupDetails = async () => {
      if (groupId) {
        const { data, error } = await supabase
          .from("groups")
          .select("*")
          .eq("id", groupId)
          .single();
        
        if (error) {
          toast.error("Failed to load group details");
          console.error("Error fetching group details:", error);
          redirect("/app/groups");
          // Optionally, you can redirect the user if they don't have access
          // For example: router.push('/groups');
          // or set some state to show an error message
          // Here, we just log the error
          // Handle error (e.g., redirect or show message)
        } else {
          console.log("Group details:", data);
          setGroupData(data);
          // Optionally verify if the user has access to this group
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
              <CardTitle>Group Dashboard</CardTitle>
              <CardDescription>asdasd</CardDescription>
            </CardHeader>
            <CardContent>
              {groupData ? (
                <div>
                  <p>Welcome to the dashboard of <strong>{groupData.name}</strong>!</p>
                  <p>Group ID: {groupData.id}</p>
                  {/* Add more group details and dashboard content here */}
                </div>
              ) : (
                !loading && <p>Group not found or you do not have access.</p>
              )}
            </CardContent>
          </Card>
        </Reveal>
      </ScrollArea>
      <GroupBottombar />
    </>
  )
}