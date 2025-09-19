import { createClient } from "@/lib/supabase/server"
import PageWrapper from "@/components/page-wrapper"
import { NavbarApp } from "@/components/navbar-app"
import { MobileTopbar } from "@/components/mobile-topbar"
import { redirect } from "next/navigation"

export default async function UserHomePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/login")
  }
  const user = data.user

  return (
    <>
      <NavbarApp />
      <PageWrapper>
        <div className="p-4 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Hello, {user.user_metadata.full_name || user.email}!</h1>
          <p>Welcome to your dashboard. Here you can access your groups, chat, and profile.</p>
          {/* Bisa tambah widget dashboard, quick links, dll */}
        </div>
      </PageWrapper>
    </>
  )
}
