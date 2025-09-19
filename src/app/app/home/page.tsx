"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/supabase/auth"
import PageWrapper from "@/components/page-wrapper"
import { NavbarApp } from "@/components/navbar-app"
import Reveal from "@/components/animations/Reveal"

export default function UserHomePage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      console.log(user)
      console.log("No user, redirecting to login")
      router.push("/login")
    }
  }, [user, router])

  if (!user) return null // atau loading spinner

  return (
    <>
      <NavbarApp />
      <PageWrapper>
        <div className="p-4 max-w-4xl mx-auto">
          <Reveal>
            <h1 className="text-2xl font-bold mb-4">Hello, {user.user_metadata.full_name || user.email}!</h1>
          </Reveal>
          <Reveal delay={0.3}>
            <p>Welcome to your dashboard. Here you can access your groups, chat, and profile.</p>
          </Reveal>
          {/* Bisa tambah widget dashboard, quick links, dll */}
        </div>
      </PageWrapper>
    </>
  )
}