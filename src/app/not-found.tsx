"use client"

import Link from "next/link"
import { useAuth } from "@/lib/supabaseAuth"

export default function NotFound() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-lg">Page not found</p>
      <Link
        href={user ? "/app/home" : "/"}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go Home
      </Link>
    </div>
  )
}