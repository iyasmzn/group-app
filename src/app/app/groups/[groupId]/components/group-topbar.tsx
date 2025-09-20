"use client"
import Reveal from "@/components/animations/Reveal";
import { AppTopbar } from "@/components/app/topbar";
import { GroupAvatar } from "@/components/group-avatar";
import { useAuth } from "@/lib/supabase/auth";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function GroupTobar() {
  const {supabase} = useAuth()
  const params = useParams();
  const groupId = params?.groupId;
  const [groupData, setGroupData] = useState<any>(null);
  console.log("Group ID:", groupId);
  
  useEffect(() => {
    // Fetch group details to verify access
    const fetchGroupDetails = async () => {
      if (groupId) {
        // get grpoup details with list members
        const { data, error } = await supabase
          .from("groups")
          .select("*, group_members(*)")
          .eq("id", groupId)
          .single();
        
        if (error) {
          console.error("group-topbar.tsx - Error fetching group details:", error);
        } else {
          console.log("Group details:", data);
          setGroupData(data);
          // Optionally verify if the user has access to this group
        }
      }
    };

    fetchGroupDetails()
  }, [groupId, supabase]);
  
  function TitleWithGroupAvatar() {
    if (!groupData) return <span></span>
    
    return (
      <div className="flex items-center gap-2">
        <div className="">
            <Reveal animation="fadeInRight" distance={10}>
                <GroupAvatar name={groupData?.name} image={groupData?.image_url} size="md" />
            </Reveal>
        </div>
        <Reveal animation="fadeInRight" delay={0.5} distance={10}>
            <div className="flex flex-col leading-tight">
                <span className="font-semibold text-lg">{groupData?.name}</span>
                <span className="text-sm text-muted-foreground">
                      {/* groupData member total */}
                      {groupData?.group_members?.length}
                      {' '}member{groupData?.group_members?.length !== 1 ? 's' : ''}
                </span>
            </div>
        </Reveal>
      </div>
    );
  }
  return (
    <>
      <AppTopbar backHref="/app/groups" titleSlot={TitleWithGroupAvatar()} />
      <div className="h-10" /> {/* spacer untuk topbar */}
    </>
  )
}