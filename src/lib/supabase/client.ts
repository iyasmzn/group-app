import { Database } from "@/types/database.types"
import { createClient } from "@supabase/supabase-js"

export const supabase = createClient<Database>(
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