export async function uploadToCloudinary(file: File): Promise<{ secure_url: string; public_id: string } | null> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    console.error("Cloudinary env not set")
    return null
  }

  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", uploadPreset)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
    method: "POST",
    body: formData,
  })

  if (!res.ok) {
    console.error("Cloudinary upload failed")
    return null
  }

  const data = await res.json()
  return { secure_url: data.secure_url, public_id: data.public_id }
}

export function getBlurThumbnailUrl(url: string, size = 20) {
  if (!url) return ""

  // Cloudinary URL biasanya: https://res.cloudinary.com/<cloud_name>/image/upload/v12345/filename.jpg
  // Kita sisipkan transformasi setelah "upload/"
  return url.replace(
    "/upload/",
    `/upload/w_${size},q_auto:low,e_blur:200/`
  )
}