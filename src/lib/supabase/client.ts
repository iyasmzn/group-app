import { createClient } from "@supabase/supabase-js"
import { RealtimeClient } from "@supabase/realtime-js"

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      realtime: {
        client: new RealtimeClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!.replace("https", "wss")
        ),
      },
    },
  }
)