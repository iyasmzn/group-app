import type { NextRequest } from "next/server"
import { updateSession } from "./lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  return updateSession(request)
}

// hanya jalankan middleware di /app/**
export const config = {
  matcher: ["/app/:path*"],
}