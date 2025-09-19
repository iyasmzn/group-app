import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { public_id } = await req.json()
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: "Cloudinary env not set" }, { status: 500 })
  }

  const timestamp = Math.round(new Date().getTime() / 1000)
  const crypto = (await import("crypto")).default
  const signature = crypto
    .createHash("sha1")
    .update(`public_id=${public_id}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex")

  const formData = new URLSearchParams()
  formData.append("public_id", public_id)
  formData.append("api_key", apiKey)
  formData.append("timestamp", timestamp.toString())
  formData.append("signature", signature)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: "POST",
    body: formData,
  })

  const data = await res.json()
  return NextResponse.json(data)
}
