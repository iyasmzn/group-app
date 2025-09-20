"use client"
import { useState } from "react"
import { useAuth } from "@/lib/supabase/auth"
import { useRouter } from "next/navigation"
import LoadingOverlay from "@/components/loading-overlay"

export default function SignupPage() {
  const { signUp } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("iyasmzn07@gmail.com")
  const [password, setPassword] = useState("asdasd")
  const [name, setName] = useState("Asd Asd")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signUp(email, password, name)
      // toast
      router.push("/email-confirm") // redirect after signup
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <>
      {loading && <LoadingOverlay />}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 flex flex-col gap-2">
        <h1 className="text-xl font-bold mb-2">Sign Up</h1>
        {error && <p className="text-red-600">{error}</p>}
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="border rounded p-2"/>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border rounded p-2"/>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="border rounded p-2"/>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Sign Up</button>
      </form>
    </>
  )
}
