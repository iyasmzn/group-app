'use client'
import Reveal from '@/components/animations/Reveal'
import { AppAvatar } from '@/components/ui/app-avatar'
import { GroupData } from '@/types/group.type'
import { useRouter } from 'next/navigation'

export function GroupTitle({ group }: { group: GroupData }) {
  const router = useRouter()
  return (
    <div
      className="flex items-center gap-2 cursor-pointer"
      onClick={() => router.push(`/app/groups/${group.id}/profile`)}
    >
      <Reveal animation="fadeIn">
        <AppAvatar name={group.name} image={group.image_url} size="md" />
      </Reveal>
      <Reveal animation="fadeIn" delay={0.5}>
        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-md">{group.name}</span>
          <span className="text-sm text-muted-foreground">
            {group.group_members?.length} member{group.group_members?.length !== 1 ? 's' : ''}
          </span>
        </div>
      </Reveal>
    </div>
  )
}
