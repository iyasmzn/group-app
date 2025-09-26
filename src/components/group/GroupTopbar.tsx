"use client"
import { AppTopbar } from "@/components/app/topbar"
import { useParams } from "next/navigation"
import { useGroupData } from "@/lib/hooks/useGroupData"
import { GroupTitle } from "@/components/group/GroupTitle"
import { GroupTopbarMenu } from "@/components/group/GroupTopbarMenu"
import { GroupTitleSkeleton } from "@/components/group/GroupTitleSkeleton"

type GroupTopbarProps = {
  backHref?: string
}

export default function GroupTopbar({ backHref = "/app/groups" }: GroupTopbarProps) {
  const params = useParams()
  const groupId = params?.groupId as string
  const groupData = useGroupData(groupId)

  return (
    <>
      <AppTopbar
        backHref={backHref}
        titleSlot={
          groupData ? <GroupTitle group={groupData} /> : <GroupTitleSkeleton />
        }
        endSlot={<GroupTopbarMenu />}
      />
    </>
  )
}