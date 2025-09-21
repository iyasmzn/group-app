"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/supabase/auth"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Loader } from "@/components/animations/loader"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function InvitePage() {
  const { code } = useParams()
  const { user, supabase } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [groupLink, setGroupLink] = useState("")
  const router = useRouter()

  useEffect(() => {
    setLoading(true)
    
    const joinGroup = async () => {
      if (!user) return

      const { data: invite } = await supabase
        .from("group_invites")
        .select("group_id, expires_at, group_role_id")
        .eq("code", code)
        .maybeSingle()

      if (!invite) {
        setError("Invite tidak valid.")
        return 
      }

      if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
        setError("Link sudah expired.")
        return
      }

      await supabase.from("group_members").insert({
        group_id: invite.group_id,
        user_id: user.id,
        role_id: invite.group_role_id,
      })

      setGroupLink(`/groups/${invite.group_id}/dashboard`)
    }

    joinGroup().finally(() => {
        setLoading(false)
        if (error) toast.error(error)
        else if (groupLink) setTimeout(() => {
          router.push(groupLink)
        }, 5000);
    })
  }, [code, user, router])

  return (
    <Card>
      <CardContent className="flex justify-center items-center">
        {
          loading && (
            <div className="flex flex-col items-center justify-center">
              <Loader type="heartbeat" />
              <span className="text-xl">Bergabung ke grup ...</span>
            </div>
          )
        }
        {
          !loading && !error ? (
            <div>
              <CheckCircle />
              Berhasil bergabung ke grup. Dipindahkan ke dashboard grup dalam 5 detik.
              <Button variant={'ghost'} onClick={() => router.push(groupLink)}>Klik untuk langsung ke Dashboard</Button>
            </div>
          ) : null
        }
        {
          !loading && error ? (
            <></>
          ) : null
        }
      </CardContent>
    </Card>
  )
}
