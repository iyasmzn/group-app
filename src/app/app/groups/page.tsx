"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import { UserAvatarGroup } from "@/components/user-avatar-group"
import PageWrapper from "@/components/page-wrapper"

export default function GroupsPage({ userId }: { userId: string }) {
  const [groups, setGroups] = useState<any[]>([])
  const [newGroupName, setNewGroupName] = useState("")
  const members = [
  { id: 1, user_metadata: { full_name: "Iyas Muzani" } },
  { id: 2, user_metadata: { full_name: "John Doe" } },
  { id: 3, user_metadata: { full_name: "Jane Smith" } },
  { id: 4, user_metadata: { full_name: "Michael Lee" } },
  { id: 5, user_metadata: { full_name: "Sarah Connor" } },
]

  useEffect(() => {
    const fetchGroups = async () => {
      const { data } = await supabase
        .from("group_members")
        .select("groupId(id, name)")
        .eq("userId", userId)
      setGroups(data?.map(d => d.groupId) || [])
    }
    fetchGroups()
  }, [userId])

  const createGroup = async () => {
    if (!newGroupName.trim()) return

    const { data: group } = await supabase
      .from("groups")
      .insert([{ name: newGroupName }])
      .select()
      .single()

    if (!group) return

    // buat role owner default
    const { data: ownerRole } = await supabase
      .from("roles")
      .insert([{ groupId: group.id, name: "Owner", permissions: ["manage_members","manage_roles","send_message","delete_message"] }])
      .select()
      .single()

    if (!ownerRole) return

    // tambahkan creator sebagai member
    await supabase.from("group_members").insert([{ groupId: group.id, userId, roleId: ownerRole.id }])
    setGroups(prev => [...prev, group])
    setNewGroupName("")
  }

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Your Groups</h1>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="New group name"
            className="border rounded p-2 flex-1"
            value={newGroupName}
            onChange={e => setNewGroupName(e.target.value)}
          />
          <button onClick={createGroup} className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700">
            Create
          </button>
        </div>

        <ul className="space-y-2">
          {groups.map(group => (
            <li key={group.id} className="flex justify-between items-center p-2 border rounded hover:bg-gray-50">
              <Link href={`/groups/${group.id}/chat`} className="font-medium">{group.name}</Link>
              <Link href={`/groups/${group.id}/manage`} className="text-sm text-gray-500 hover:underline">
                Manage
              </Link>
            </li>
          ))}
        </ul>
        <div className="p-6">
          <h2 className="font-bold text-xl mb-4">Group Members</h2>
          <UserAvatarGroup users={members} max={3} size={40} />
        </div>
      </div>
    </PageWrapper>
  )
}
