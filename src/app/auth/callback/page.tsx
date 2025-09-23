"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      // Supabase akan otomatis handle access token di URL
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        console.error("Auth callback error:", error)
        router.replace("/login?error=auth")
        return
      }

      if (data.session) {
        // sukses login → redirect ke halaman app
        router.replace("/app/home")
      } else {
        // kalau session kosong → kembali ke login
        router.replace("/login")
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-sm text-muted-foreground"></p>
    </div>
  )
}
