"use client"

import Link from "next/link"
import { useAuth } from "@/lib/supabase/auth"
import BackButton from "@/components/back-button"

export default function NotFound() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-lg">Page not found</p>
      <div className="flex items-center mt-6 gap-4 ">
        <BackButton label="Kembali" />
        <Link
          href={user ? "/app/home" : "/"}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}