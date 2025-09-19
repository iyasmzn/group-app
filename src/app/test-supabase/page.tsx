"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"

export default function TestSupabase() {
  const [groupData, setGroupData] = useState<any[]>([])
  const [userData, setUserData] = useState<any[]>([])

  useEffect(() => {
    const fetchGroupData = async () => {
      const { data } = await supabase.from("groups").select("*")
      setGroupData(data || [])
    }
    const fetchUserData = async () => {
      const { data } = await supabase.from("users").select("*")
      setUserData(data || [])
    }

    const getAllData = async () => {
      await fetchGroupData()
      await fetchUserData()
    }
    getAllData()
  }, [])

  return (
    <div>
      <h1>Groups {groupData.length}</h1>
      <pre>{JSON.stringify(groupData, null, 2)}</pre>
      <h1>User {userData.length}</h1>
      <pre>{JSON.stringify(userData, null, 2)}</pre>
    </div>
  )
}
