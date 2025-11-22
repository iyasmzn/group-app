import type { User } from "@supabase/supabase-js"
import { Database } from "@/types/database.types"
import { supabase } from "@/lib/supabase/client"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export const authService = {
  async signUp(email: string, password: string, name: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    })
    if (error) throw new Error(error.message)
  },

  async signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
  },

  async signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) throw new Error(error.message)
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
  },

  async updateUserMeta(data: Partial<User["user_metadata"]>) {
    const { error } = await supabase.auth.updateUser({ data })
    if (error) throw new Error(error.message)
  },

  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()
    if (error) throw new Error(error.message)
    return data
  },

  async updateProfile(userId: string, data: Partial<Omit<Profile, "id">>) {
    const { error } = await supabase.from("profiles").update(data).eq("id", userId)
    if (error) throw new Error(error.message)
  },

  async updateProfileHybrid(userId: string, data: { full_name?: string; avatar_url?: string }) {
    const updates: Partial<Pick<Profile, "full_name" | "avatar_url">> = {}
    if (data.full_name !== undefined) updates.full_name = data.full_name
    if (data.avatar_url !== undefined) updates.avatar_url = data.avatar_url

    const { error: profileError } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
    if (profileError) throw new Error(profileError.message)

    const { error: metaError } = await supabase.auth.updateUser({
      data: {
        ...(data.full_name ? { full_name: data.full_name } : {}),
        ...(data.avatar_url !== undefined ? { avatar_url: data.avatar_url } : {}),
      },
    })
    if (metaError) throw new Error(metaError.message)
  },
}