"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import PageWrapper from "@/components/page-wrapper"
import { AppTopbar } from "@/components/app/topbar"
import { Home } from "lucide-react"
import { AppBottombar } from "@/components/app/bottombar"
import { GroupAvatar } from "@/components/group-avatar"
import { useAuth } from "@/lib/supabase/auth"

export default function GroupsPageWrapper() {
  const { user } = useAuth()

  if (!user) {
    return (
      <PageWrapper>
        <div className="max-w-4xl mx-auto p-4">
          <p className="text-center">Please <Link href="/login" className="text-blue-600 hover:underline">login</Link> to view your groups.</p>
        </div>
      </PageWrapper>
    )
  }

  return <GroupsPage userId={user.id} />
}

function GroupsPage({ userId }: { userId: string }) {
  const [groups, setGroups] = useState<any[]>([])
  const [newGroupName, setNewGroupName] = useState("")

  useEffect(() => {
    const fetchGroups = async () => {
      const { data } = await supabase
        .from("group_members")
        .select("group_id(id, name)")
        .eq("user_id", userId)
      setGroups(data?.map(d => d.group_id) || [])
    }
    fetchGroups()
  }, [userId])

  const createGroup = async () => {
    if (!newGroupName.trim()) return

    const { data: group } = await supabase
      .from("groups")
      .insert([{ name: newGroupName, owner_id: userId }])
      .select()
      .single()

    console.log("Created group:", group)

    if (!group) return

    // buat role owner default
    const { data: ownerRole } = await supabase
      .from("group_roles")
      .insert([{ 
        group_id: group.id, 
        name: "Owner", 
        permissions: ["manage_members","manage_roles","send_message","delete_message"] 
      }])
      .select()
      .single()

    if (!ownerRole) return

    // tambahkan creator sebagai member
    await supabase.from("group_members").insert([{ 
      group_id: group.id, 
      user_id: userId, 
      role_id: ownerRole.id 
    }])

    setGroups(prev => [...prev, group])
    setNewGroupName("")
  }

  return (
    <>
      <AppBottombar />
      <AppTopbar title="Groups" titleIcon={<Home className="h-6 w-6" />} />
      <PageWrapper>
        <div className="max-w-4xl mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Your Groups</h1>

          {/* Form create group */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="New group name"
              className="border rounded p-2 flex-1"
              value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
            />
            <button 
              onClick={createGroup} 
              className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
            >
              Create
            </button>
          </div>

          {/* List groups */}
          <ul className="space-y-2">
            {groups.map(group => (
              <li 
                key={group.id} 
                className="flex items-center justify-between p-2 border rounded hover:bg-muted"
              >
                <Link href={`/groups/${group.id}/chat`} className="flex items-center gap-3">
                  {/* Avatar inisial */}                
                  <GroupAvatar 
                    name={group.name} 
                    image={group.avatar_url} // kalau ada, tampil gambar
                    size="md" 
                  />
                  <span className="font-medium">{group.name}</span>
                </Link>
                <Link 
                  href={`/groups/${group.id}/manage`} 
                  className="text-sm text-muted-foreground hover:underline"
                >
                  Manage
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </PageWrapper>
    </>
  )
}
