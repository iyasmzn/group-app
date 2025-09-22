"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/supabase/auth"
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Users, Link as LinkIcon, Bell, Settings, UserPlus2, BellRing, Undo2, Edit3, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Reveal from "@/components/animations/Reveal"
import LoadingOverlay from "@/components/loading-overlay"
import CreatedCard from "./components/created-card"
import DescriptionCard from "./components/description-card"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { groupService } from "@/services/groupService/groupService"
import { Skeleton } from "@/components/ui/skeleton"
import { GroupAvatar } from "@/components/group-avatar"
import InviteLink from "./components/invite-link"
import { GroupData, GroupMember } from "@/types/group"

export default function GroupProfilePage() {
  const {supabase} = useAuth()
  const {update} = groupService
  const { groupId } = useParams()
  const [group, setGroup] = useState<GroupData | null>(null)
  const [groupName, setGroupName] = useState("")
  const [groupNameEdit, setGroupNameEdit] = useState(false)
  const [groupNameLoading, setGroupNameLoading] = useState(false)
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/app/groups")
    }
  }

  useEffect(() => {
    const fetchGroup = async () => {
      const { data, error } = await supabase
        .from("groups")
        .select(`
          *,
          owner:profiles!groups_owner_id_fkey1 (*),
          desc_updatedby:profiles!groups_description_updatedby_fkey (*),
          group_members (
            group_roles (
              id, name, permissions
            ),
            profiles (
              id, full_name, avatar_url
            )
          )
        `)
        .eq("id", groupId)
        .single()

      if (error) {
        toast.error(error?.message || 'Error getting group detail data.')
      } else {
        setGroup(data)
        setGroupName(data.name)
      }
    }
    fetchGroup()
  }, [groupId]) // eslint-disable-next-line no-use-before-define

  const updateGroupName = async () => {
    if (!group) return
    
    setGroupNameEdit(false)
    setGroupNameLoading(true)
    await update(group.id, {
      name: groupName
    }).then(res => {
      toast.success("Success update group name.")
      setGroup({
        ...group,
        name: groupName
      })
      console.log('res',res)
    }).catch(error => {
      toast.error(error?.message || "Failed update group name.")
      console.log(error)
    }).finally(() => {
      setGroupNameLoading(false)
    })
  }

  if (!group) return <LoadingOverlay />

  return (
    <>
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex flex-col items-center py-8">
          <GroupAvatar image={group.image_url} name={group.name} size="xxl" />
          <div>
            {
              groupNameEdit ? (
                <Reveal animation="fadeIn">
                  <div className="flex gap-1 items-center mt-2 mb-1">
                    <Input className="flex-1" value={groupName} onChange={e => setGroupName(e.target.value)}></Input>
                    <Button variant={'primary-outline'} onClick={updateGroupName}>
                      <Save />
                    </Button>
                    <Button variant={'ghost'} onClick={() => setGroupNameEdit(false)}>
                      <X />
                    </Button>
                  </div>
                </Reveal>
                ) :
                groupNameLoading ? <Skeleton className="w-40 h-8 mt-2"></Skeleton>
                :
                (
                <Reveal animation="fadeIn" key={'group_name_key'}>
                  <h1 className="mt-4 text-2xl font-bold flex items-center gap-2">
                    {group.name} <Edit3 onClick={() => {setGroupNameEdit(true);setGroupName(group.name)}} className="text-secondary-foreground w-4 h-4 cursor-pointer" />
                  </h1>
                </Reveal>
                )
            }
          </div>
        </div>

        {/* Action list */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button onClick={handleBack} className="flex flex-col py-2 px-3 rounded-xl items-center border border-secondary hover:bg-secondary transition-all">
            <Undo2 className="w-7 h-7" />
            <span className="text-xs mt-1 text-foreground">Go Back</span>
          </button>
          <button className="flex flex-col py-2 px-3 rounded-xl items-center border border-primary hover:bg-secondary transition-all">
            <UserPlus2 className="w-7 h-7 text-primary" />
            <span className="text-xs mt-1 text-foreground">Add Member</span>
          </button>
          <InviteLink />
          <button className="flex flex-col py-2 px-3 rounded-xl items-center border border-primary hover:bg-secondary transition-all">
            <BellRing className="w-7 h-7 text-primary" />
            <span className="text-xs mt-1 text-foreground">Notifications</span>
          </button>
        </div>

        {/* created */}
        <Reveal animation="fadeIn">
          <CreatedCard group={group} />
        </Reveal>
        {/* description */}
        <Reveal animation="fadeIn" delay={0.3}>
          <DescriptionCard group={group} />
        </Reveal>
        <div className="divide-y">
          <div className="flex items-center gap-3 p-4 hover:bg-accent cursor-pointer">
            <Users className="h-5 w-5" />
            <span>Add Members</span>
          </div>
          <div className="flex items-center gap-3 p-4 hover:bg-accent cursor-pointer">
            <Users className="h-5 w-5" />
            <span>Add Members</span>
          </div>
          <div className="flex items-center gap-3 p-4 hover:bg-accent cursor-pointer">
            <LinkIcon className="h-5 w-5" />
            <span>Group Invite Link</span>
          </div>
          <div className="flex items-center gap-3 p-4 hover:bg-accent cursor-pointer">
            <Bell className="h-5 w-5" />
            <span>Mute Notifications</span>
          </div>
          <div className="flex items-center gap-3 p-4 hover:bg-accent cursor-pointer">
            <Settings className="h-5 w-5" />
            <span>Group Settings</span>
          </div>
        </div>

        {/* Members */}
        <div className="mt-6">
          <div className="px-4 flex items-center justify-between">
            <h2 className=" mb-2 text-sm font-semibold text-muted-foreground">
              Members
            </h2>
            <p className="text-sm text-muted-foreground">
              {group?.group_members?.length} member
              {group?.group_members?.length !== 1 ? "s" : ""}
            </p>
          </div>
          <ul className="divide-y">
            {group?.group_members?.map((m: GroupMember) => (
              <li
                key={m?.profiles?.id}
                className="flex items-center justify-between p-4 hover:bg-accent"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    {m?.profiles?.avatar_url ? (
                      <AvatarImage
                        src={m.profiles.avatar_url}
                        alt={m.profiles.full_name}
                      />
                    ) : (
                      <AvatarFallback>
                        {m?.profiles?.full_name
                          .split(" ")
                          .slice(0, 2)
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <p className="font-medium">{m.profiles?.full_name}</p>
                    <p className="text-xs text-muted-foreground">{m?.group_roles?.name}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-blue-600">
                  Last Online
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}
