"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      const { error } = await supabase.auth.getSession()

      if (error) {
        console.error("Auth callback error:", error)
        router.replace("/login?error=auth")
        return
      }

      router.replace("/app/home")
    }

    handleCallback()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-sm text-muted-foreground">Authenticating...</p>
    </div>
  )
}