import { createBrowserClient } from "@supabase/ssr"

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      flowType: "pkce", // ✅ pastikan pakai PKCE
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
)