import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import type { Database } from "@/types/database.types" // Add your Database type

export async function updateSession(request: NextRequest) {
  // Ensure environment variables are set
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error("Missing Supabase environment variables")
  }

  const response = NextResponse.next()

  const supabase = createServerClient<Database>( // Add type for better safety
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error("Session error:", error.message)
      // Optionally handle errors (e.g., redirect to error page)
    }

    // Define protected and allowed paths
    const protectedPaths = ["/app"]
    const allowedPaths = ["/login", "/auth", "/error"]
    const isProtected = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))
    const isAllowed = allowedPaths.some(path => request.nextUrl.pathname.startsWith(path))

    if (!session && isProtected && !isAllowed) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }
  } catch (err) {
    console.error("Middleware error:", err)
    // Fallback: allow request to proceed or redirect to error page
  }

  return response
}
