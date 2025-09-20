"use client"
import { GroupAvatar } from "@/components/group-avatar";
import LoadingOverlay from "@/components/loading-overlay";
import { useAuth } from "@/lib/supabase/auth";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import GroupTobar from "../components/group-topbar";

export default function GroupDashboardPage() {
  const {supabase} = useAuth()
  const params = useParams();
  const groupId = params?.groupId;
  const [loading, setLoading] = useState(true);
  const [groupData, setGroupData] = useState<any>(null);
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
      <GroupTobar />
      <div className="py-6">
        <h1 className="text-2xl font-semibold">Group Dashboard</h1>
        <p className="mt-4 text-muted-foreground">Welcome to your group dashboard. Here you can manage your group's activities and settings.</p>
      </div>
    </>
  )
}