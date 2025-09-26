"use client"
import Reveal from "@/components/animations/Reveal"
import { GroupAvatar } from "@/components/group-avatar"
import { GroupData } from "@/types/group"
import { useRouter } from "next/navigation"

export function GroupTitle({ group }: { group: GroupData }) {
  const router = useRouter()
  return (
    <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("profile")}>
      <Reveal animation="fadeInRight" distance={10}>
        <GroupAvatar name={group.name} image={group.image_url} size="md" />
      </Reveal>
      <Reveal animation="fadeInRight" delay={0.5} distance={10}>
        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-md">{group.name}</span>
          <span className="text-sm text-muted-foreground">
            {group.group_members?.length} member{group.group_members?.length !== 1 ? "s" : ""}
          </span>
        </div>
      </Reveal>
    </div>
  )
}