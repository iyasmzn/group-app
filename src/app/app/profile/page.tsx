"use client"

import { useState } from "react"
import { useAuth } from "@/lib/supabase/auth"
import { UserAvatar } from "@/components/user-avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import PageWrapper from "@/components/page-wrapper"
import { AppTopbar } from "@/components/app/topbar"

export default function ProfilePage() {
  const { user, updateUserMeta } = useAuth()
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "")
  const [loading, setLoading] = useState(false)
  const [overlayPreview, setOverlayPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // ✅ Update nama
  const handleUpdate = async () => {
    setLoading(true)
    try {
      await updateUserMeta({ full_name: fullName })
      toast.success("Profile updated")
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile")
    }
    setLoading(false)
  }

  // ✅ Select avatar (show overlay preview)
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    setSelectedFile(file)
    setOverlayPreview(URL.createObjectURL(file))
  }

  // ✅ Confirm upload avatar
  const handleUpload = async () => {
    if (!selectedFile) return
    setOverlayPreview(null)
    setIsProcessing(true)

    try {
      const result = await uploadToCloudinary(selectedFile)

      if (result) {
        // hapus avatar lama kalau ada
        const oldPublicId = user?.user_metadata?.avatar_public_id
        if (oldPublicId) {
          await fetch("/api/cloudinary/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ public_id: oldPublicId }),
          })
        }

        await updateUserMeta({
          avatar_url: result.secure_url,
          avatar_public_id: result.public_id,
        })

        toast.success("Avatar updated")
        setSelectedFile(null)
      } else {
        toast.error("Upload failed ❌")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload avatar")
    }

    setIsProcessing(false)
  }

  // ✅ Remove avatar
  const handleRemoveAvatar = async () => {
    setIsProcessing(true)
    try {
      const oldPublicId = user?.user_metadata?.avatar_public_id
      if (oldPublicId) {
        await fetch("/api/cloudinary/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_id: oldPublicId }),
        })
      }

      await updateUserMeta({
        avatar_url: null,
        avatar_public_id: null,
      })

      toast.success("Avatar removed")
    } catch (err: any) {
      toast.error(err.message || "Failed to remove avatar")
    }
    setIsProcessing(false)
  }

  return (
    <>
      <AppTopbar title="Profile" backHref="/app/settings" hideAvatarUser />
      <PageWrapper>
        <div className="p-6 max-w-lg mx-auto space-y-8 relative">
          {/* Loading Overlay */}
          {isProcessing && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <Loader2 className="h-10 w-10 text-white animate-spin" />
            </div>
          )}

          {/* Preview Overlay */}
          {overlayPreview && (
            <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={overlayPreview}
                alt="avatar preview"
                className="w-40 h-40 rounded-full object-cover border-4 border-white mb-6"
              />
              <div className="flex gap-4">
                <Button onClick={handleUpload} disabled={isProcessing}>
                  Confirm
                </Button>
                <Button variant="outline" onClick={() => setOverlayPreview(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Profile header */}
          <div className="flex flex-col items-center space-y-3">
            <UserAvatar user={user} size={80} />

            <label className="text-sm text-blue-600 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
              Change Avatar
            </label>

            {user?.user_metadata?.avatar_url && (
              <Button variant="outline" onClick={handleRemoveAvatar} disabled={isProcessing}>
                Remove Avatar
              </Button>
            )}

            <h2 className="text-xl font-semibold">{fullName}</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>

          {/* Edit form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          {user?.app_metadata?.provider === "email" && (
            <div className="mt-6">
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
            </div>
          )}
        </div>
      </PageWrapper>
    </>
  )
}
