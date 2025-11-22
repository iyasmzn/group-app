'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { toast } from 'sonner'
import PageWrapper from '@/components/page-wrapper'
import { AppTopbar } from '@/components/app/topbar'
import { Skeleton } from '@/components/ui/skeleton'
import { UnifiedUploader } from '@/components/unified-uploader'
import LoadingOverlay from '@/components/loading-overlay'
import { AppAvatar } from '@/components/ui/app-avatar'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useProfile } from '@/lib/hooks/useProfile'
import { useAuth } from '@/context/AuthContext'

export default function ProfilePage() {
  const { user, updateUserMeta, updateProfile, loading } = useAuth()
  const { profile, loading: profileLoading } = useProfile()
  const [fullName, setFullName] = useState<string>('')
  const [saving, setSaving] = useState<boolean>(false)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  if (profile && fullName === '' && profile.full_name) {
    setFullName(profile.full_name)
  }

  const handleUpdate = async (): Promise<void> => {
    if (!user) return
    setSaving(true)
    try {
      await updateProfile(user.id, { full_name: fullName })
      await updateUserMeta({ full_name: fullName })
      toast.success('Profile updated')
    } catch (err) {
      toast.error('Failed to update profile')
      console.error(err)
    }
    setSaving(false)
  }

  const handleUploadAvatar = async (files: File[]): Promise<void> => {
    if (!user) return
    if (!files.length) return
    setIsProcessing(true)
    try {
      const file = files[0]
      const result = await uploadToCloudinary(file)

      if (result) {
        const oldPublicId = user?.user_metadata?.avatar_public_id as string | undefined
        if (oldPublicId) {
          await fetch('/api/cloudinary/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ public_id: oldPublicId }),
          })
        }

        await updateProfile(user.id, {
          avatar_url: result.secure_url,
          avatar_public_id: result.public_id,
        })
        await updateUserMeta({
          avatar_url: result.secure_url,
          avatar_public_id: result.public_id,
        })

        toast.success('Avatar updated')
      }
    } catch (err) {
      toast.error('Failed to upload avatar')
      console.error(err)
    }
    setIsProcessing(false)
  }

  const handleRemoveAvatar = async (): Promise<void> => {
    if (!user) return
    setIsProcessing(true)
    try {
      const oldPublicId = user?.user_metadata?.avatar_public_id as string | undefined
      if (oldPublicId) {
        await fetch('/api/cloudinary/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ public_id: oldPublicId }),
        })
      }

      await updateProfile(user.id, { avatar_url: null, avatar_public_id: null })
      await updateUserMeta({ avatar_url: null, avatar_public_id: null })

      toast.success('Avatar removed')
    } catch (err) {
      toast.error('Failed to remove avatar')
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
            {profileLoading || loading ? (
              <>
                <Skeleton className="h-28 w-28 rounded-full" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-40" />
              </>
            ) : (
              <>
                <AppAvatar
                  name={profile?.full_name || profile?.email || 'Guest'}
                  image={profile?.avatar_url}
                  size="xl"
                  preview
                />
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  {profile?.full_name || 'Guest'}
                  {/* contoh badge verified */}
                  <Badge variant="secondary">Verified</Badge>
                </h2>
                <p className="text-foreground text-sm">{profile?.email}</p>
                {user?.created_at && (
                  <p className="text-secondary-foreground text-xs">
                    Joined{' '}
                    {new Date(user.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Edit form */}
          {!loading && (
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Avatar</Label>
                  <UnifiedUploader
                    accept="image/*"
                    multiple={false}
                    enableCrop={true}
                    aspect={1}
                    onUpload={handleUploadAvatar}
                    onRemove={handleRemoveAvatar}
                  />
                  <p className="text-xs text-muted-foreground">
                    This image will be visible to other users in chats and groups.
                  </p>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm font-medium">Full Name</Label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your full name will appear on your profile and messages.
                  </p>
                </div>

                <Button onClick={handleUpdate} disabled={saving} className="w-full">
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Read-only info */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="font-medium">{profile?.email || '-'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">User ID</span>
                <span className="font-mono text-xs">{user?.id}</span>
              </div>
              {user?.created_at && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Joined</span>
                  <span className="font-medium">
                    {new Date(user.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </PageWrapper>
    </>
  )
}
