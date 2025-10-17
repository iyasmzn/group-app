'use client'
import { AppTopbar } from '@/components/app/topbar'
import { useGroupBadges } from '@/context/GroupBadgeContext'
import { GroupTitle } from './GroupTitle'
import { GroupTopbarMenu } from './GroupTopbarMenu'
import { GroupTitleSkeleton } from './GroupTitleSkeleton'

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
