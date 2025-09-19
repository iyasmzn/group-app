export async function uploadToCloudinary(file: File) {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", "GroupsRTAppsUpload")

  const res = await fetch("https://api.cloudinary.com/v1_1/dw278mlgj/upload", {
    method: "POST",
    body: formData,
  })
  const data = await res.json()
  return data.secure_url
}

