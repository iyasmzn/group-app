'use client'
import { AppTopbar } from '@/components/app/topbar'
import { GroupTitle } from '@/components/group/GroupTitle'
import { GroupTopbarMenu } from '@/components/group/GroupTopbarMenu'
import { GroupTitleSkeleton } from '@/components/group/GroupTitleSkeleton'
import { useGroupBadges } from '@/context/GroupBadgeContext'

type GroupTopbarProps = {
  backHref?: string
}

export default function GroupTopbar({ backHref = '/app/groups' }: GroupTopbarProps) {
  const { groupData } = useGroupBadges()

  return (
    <>
      <AppTopbar
        backHref={backHref}
        titleSlot={groupData ? <GroupTitle group={groupData} /> : <GroupTitleSkeleton />}
        endSlot={<GroupTopbarMenu />}
      />
    </>
  )
}
