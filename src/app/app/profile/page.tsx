"use client"

import { useState } from "react"
import { useAuth } from "@/lib/supabase/auth"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { toast } from "sonner"
import PageWrapper from "@/components/page-wrapper"
import { AppTopbar } from "@/components/app/topbar"
import { Skeleton } from "@/components/ui/skeleton"
import { UnifiedUploader } from "@/components/unified-uploader"
import LoadingOverlay from "@/components/loading-overlay"
import { useProfile } from "@/lib/hooks/useProfile"
import { AppAvatar } from "@/components/ui/app-avatar"

export default function ProfilePage() {
  const { user, updateUserMeta, updateProfile } = useAuth()
  const { profile, loading } = useProfile()
  const [fullName, setFullName] = useState<string>("")
  const [saving, setSaving] = useState<boolean>(false)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  // sinkronkan state fullName dengan profile
  // (agar input langsung terisi saat profile sudah ada)
  if (profile && fullName === "" && profile.full_name) {
    setFullName(profile.full_name)
  }

  // ✅ Update nama
  const handleUpdate = async (): Promise<void> => {
    setSaving(true)
    try {
      await updateProfile({ full_name: fullName })
      await updateUserMeta({ full_name: fullName })
      toast.success("Profile updated")
    } catch (err) {
      toast.error("Failed to update profile")
      console.error(err)
    }
    setSaving(false)
  }

  // ✅ Upload avatar
  const handleUploadAvatar = async (files: File[]): Promise<void> => {
    if (!files.length) return
    setIsProcessing(true)
    try {
      const file = files[0]
      const result = await uploadToCloudinary(file)

      if (result) {
        const oldPublicId = user?.user_metadata?.avatar_public_id as string | undefined
        if (oldPublicId) {
          await fetch("/api/cloudinary/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ public_id: oldPublicId }),
          })
        }

        await updateProfile({
          avatar_url: result.secure_url,
          avatar_public_id: result.public_id,
        })
        await updateUserMeta({
          avatar_url: result.secure_url,
          avatar_public_id: result.public_id,
        })

        toast.success("Avatar updated")
      }
    } catch (err) {
      toast.error("Failed to upload avatar")
      console.error(err)
    }
    setIsProcessing(false)
  }

  // ✅ Remove avatar
  const handleRemoveAvatar = async (): Promise<void> => {
    setIsProcessing(true)
    try {
      const oldPublicId = user?.user_metadata?.avatar_public_id as string | undefined
      if (oldPublicId) {
        await fetch("/api/cloudinary/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_id: oldPublicId }),
        })
      }

      await updateProfile({ avatar_url: null, avatar_public_id: null })
      await updateUserMeta({ avatar_url: null, avatar_public_id: null })

      toast.success("Avatar removed")
    } catch (err) {
      toast.error("Failed to remove avatar")
      console.error(err)
    }
    setIsProcessing(false)
  }

  return (
    <>
      <AppTopbar title="Profile" backButton hideAvatarUser />
      <LoadingOverlay isLoading={isProcessing} />
      <PageWrapper>
        <div className="p-6 max-w-lg mx-auto space-y-8 relative">
          {/* Profile header */}
          <div className="flex flex-col items-center space-y-3">
            {loading ? (
              <>
                <Skeleton className="h-28 w-28 rounded-full" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-40" />
              </>
            ) : (
              <>
                <AppAvatar
                  name={profile?.full_name || profile?.email || "Guest"}
                  image={profile?.avatar_url}
                  size="xl"
                  preview
                />
                <h2 className="text-xl font-semibold">
                  {profile?.full_name || "Guest"}
                </h2>
                <p className="text-foreground text-sm">{profile?.email}</p>
                {user?.created_at && (
                  <p className="text-secondary-foreground text-xs">
                    Joined{" "}
                    {new Date(user.created_at).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                    })}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Edit form */}
          {!loading && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Avatar</label>
                <UnifiedUploader
                  accept="image/*"
                  multiple={false}
                  enableCrop={true}
                  aspect={1}
                  onUpload={handleUploadAvatar}
                  onRemove={handleRemoveAvatar}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                />
              </div>

              <Button onClick={handleUpdate} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </div>
      </PageWrapper>
    </>
  )
}