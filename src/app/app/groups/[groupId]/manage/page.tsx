"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function ManageGroupPage({ groupId, currentUserId }: { groupId: string; currentUserId: string }) {
  const [members, setMembers] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])

  useEffect(() => {
    const fetchMembersAndRoles = async () => {
      const { data: membersData } = await supabase
        .from("GroupMembers")
        .select("id, userId(id, name), roleId(id, name, permissions)")
        .eq("groupId", groupId)

      const { data: rolesData } = await supabase
        .from("Roles")
        .select("*")
        .eq("groupId", groupId)

      setMembers(membersData || [])
      setRoles(rolesData || [])
    }
    fetchMembersAndRoles()
  }, [groupId])

  const updateRole = async (memberId: string, newRoleId: string) => {
    const member = members.find(m => m.id === memberId)
    if (!member || member.roleId.name === "Owner") return
    const currentUser = members.find(m => m.userId.id === currentUserId)
    if (!currentUser || !currentUser.roleId.permissions.includes("manage_roles")) return

    await supabase.from("GroupMembers").update({ roleId: newRoleId }).eq("id", memberId)
    setMembers(prev => prev.map(m => (m.id === memberId ? { ...m, roleId: roles.find(r => r.id === newRoleId) } : m)))
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Group</h1>
      <ul className="space-y-2">
        {members.map(member => (
          <li key={member.id} className="flex justify-between items-center p-2 border rounded">
            <span>{member.userId.name}</span>
            {member.roleId.name === "Owner" ? (
              <span className="font-bold text-green-600">Owner</span>
            ) : (
              <select
                value={member.roleId.id}
                onChange={e => updateRole(member.id, e.target.value)}
                className="border rounded p-1"
              >
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
