"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("Auth callback error:", error)
        router.replace("/login?error=auth")
        return
      }

      if (data.session) {
        const user = data.session.user

        try {
          // ambil avatar_url dari tabel profiles
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("avatar_url")
            .eq("id", user.id)
            .maybeSingle()

          if (profileError) throw profileError

          if (profile?.avatar_url) {
            // update metadata user
            const { error: updateError } = await supabase.auth.updateUser({
              data: { avatar_url: profile.avatar_url },
            })
            if (updateError) {
              console.error("Error updating user metadata:", updateError)
            }
          }
        } catch (err) {
          console.error("Profile fetch/update error:", err)
        }

        // sukses login → redirect ke halaman app
        router.replace("/app/home")
      } else {
        router.replace("/login")
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-sm text-muted-foreground">Authenticating...</p>
    </div>
  )
}