"use client"
import Reveal from "@/components/animations/Reveal";
import { AppTopbar } from "@/components/app/topbar";
import { GroupAvatar } from "@/components/group-avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useGroupData } from "@/lib/hooks/useGroupData";
import { EllipsisVertical } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

type GroupTopbarProps = {
  backHref?: string
}

export default function GroupTopbar({backHref = '/app/groups'}: GroupTopbarProps) {
  const params = useParams();
  const groupData = useGroupData(params?.groupId as string)
  const router = useRouter()

  function goToProfile() {
    router.push('profile')
  }
  
  function TitleWithGroupAvatar() {
    if (!groupData) return <span></span>
    
    return (
      <div className="flex items-center gap-2" onClick={() => goToProfile()}>
        <div className="">
            <Reveal animation="fadeInRight" distance={10}>
                <GroupAvatar name={groupData?.name} image={groupData?.image_url} size="md" />
            </Reveal>
        </div>
        <Reveal animation="fadeInRight" delay={0.5} distance={10}>
            <div className="flex flex-col leading-tight">
                <span className="font-semibold text-md">{groupData?.name}</span>
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

  function GroupTopbarMenu() {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical className="text-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  
  return (
    <>
      <AppTopbar backHref={backHref} titleSlot={TitleWithGroupAvatar()} endSlot={GroupTopbarMenu()} />
      <div className="h-10" /> {/* spacer untuk topbar */}
    </>
  )
}