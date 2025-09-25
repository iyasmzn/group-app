"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/supabase/auth"
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar"
import { Users, Link as LinkIcon, Bell, Settings, UserPlus2, BellRing, Undo2, Edit3, Save, X, UserCog, Link2, ShieldUser } from "lucide-react"
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
  const {user, supabase} = useAuth()
  const {update} = groupService
  const { groupId } = useParams()
  const [group, setGroup] = useState<GroupData | null>(null)
  const [groupName, setGroupName] = useState("")
  const [groupNameEdit, setGroupNameEdit] = useState(false)
  const [groupNameLoading, setGroupNameLoading] = useState(false)
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

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
              id, name, permissions, code
            ),
            profiles (
              id, email, full_name, avatar_url
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
  }, [groupId, supabase])

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

  const handleDeleteGroup = async () => {
    if (!group) return
    setDeleting(true)
    const { error } = await supabase.from("groups").delete().eq("id", group.id)
    if (error) {
      toast.error("Gagal menghapus group.")
      console.error(error)
    } else {
      toast.success("Group berhasil dihapus.")
      router.push("/app/groups")
    }
    setDeleting(false)
  }


  if (!group) return <LoadingOverlay />

  return (
    <>
      <div className="flex flex-col pb-10">
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
          <div className="flex items-center gap-3 p-4 hover:bg-accent cursor-pointer" onClick={() => router.push('roles')}>
            <ShieldUser className="h-5 w-5" />
            <span>Manage Roles</span>
          </div>
          <div className="flex items-center gap-3 p-4 hover:bg-accent cursor-pointer" onClick={() => router.push('members')}>
            <UserCog className="h-5 w-5" />
            <span>Manage Members</span>
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
            <li
              className="flex items-center justify-between p-4 hover:bg-accent"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      <UserPlus2 />
                    </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Add Member</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-blue-600">
              </span>
            </li>
            <li
              className="flex items-center justify-between p-4 hover:bg-accent"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      <Link2 />
                    </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Invite Link</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-blue-600">
              </span>
            </li>
            {group?.group_members?.map((m: GroupMember) => (
              <li
                key={m?.profiles?.id}
                className="flex items-center justify-between p-4 hover:bg-accent"
              >
                <div className="flex items-center gap-3">
                  {m?.profiles?.full_name && (
                    <GroupAvatar 
                      name={m?.profiles?.full_name}
                      image={m?.profiles?.avatar_url}
                      size="md"
                    />
                  )}
                  <div>
                    <p className="font-medium">{m.profiles?.full_name == user?.user_metadata?.full_name ? 'You' : m.profiles?.full_name}</p>
                    <p className="text-xs font-medium text-muted-foreground">{m.profiles?.email}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-blue-600">
                  <p className="text-xs text-muted-foreground">{m?.group_roles?.name}</p>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* delete group */}
        {group?.group_members?.some(m => m.group_roles?.code === "owner" && m.profiles?.id === user?.id) && (
          <Reveal animation="fadeInUp">
            <div className="mt-8 px-4">
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => {
                  if (confirm("Apakah kamu yakin ingin menghapus group ini? Tindakan ini tidak bisa dibatalkan.")) {
                    handleDeleteGroup()
                  }
                }}
                disabled={deleting}
              >
                {deleting ? "Menghapus..." : "Delete Group"}
              </Button>
            </div>
          </Reveal>
        )}
      </div>
    </>
  )
}
