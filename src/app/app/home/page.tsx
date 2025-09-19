"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/supabaseAuth"
import PageWrapper from "@/components/page-wrapper"

export default function UserHomePage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      console.log(user)
      console.log("No user, redirecting to login")
      // router.push("/login")
    }
  }, [user, router])

  if (!user) return null // atau loading spinner

  return (
    <PageWrapper>
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Hello, {user.user_metadata.full_name || user.email}!</h1>
        <p>Welcome to your dashboard. Here you can access your groups, chat, and profile.</p>
        {/* Bisa tambah widget dashboard, quick links, dll */}
      </div>
    </PageWrapper>
  )
}
