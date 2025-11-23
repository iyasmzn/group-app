type UploadResult = { secure_url: string; public_id: string } | null

type UploadOptions = {
  onProgress?: (progress: number) => void // 0 - 100
}

export async function uploadToCloudinary(
  file: File,
  options?: UploadOptions
): Promise<UploadResult> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    console.error("Cloudinary env not set")
    return null
  }

  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", uploadPreset)

    const xhr = new XMLHttpRequest()
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/upload`)

    // Progress handler
    if (options?.onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          options.onProgress?.(progress)
        }
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText)
          resolve({ secure_url: data.secure_url, public_id: data.public_id })
        } catch (err) {
          reject("Invalid JSON response")
        }
      } else {
        reject("Upload failed: " + xhr.statusText)
      }
    }

    xhr.onerror = () => reject("Network error during upload")
    xhr.send(formData)
  })
}

export function getBlurThumbnailUrl(url: string, size = 20) {
  if (!url) return ""
  return url.replace(
    "/upload/",
    `/upload/w_${size},q_auto:low,e_blur:200/`
  )
}
