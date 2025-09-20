"use client"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/supabase/auth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import LoadingOverlay from "@/components/loading-overlay"
import { toast } from "sonner"

export default function LoginPage() {
  const { signIn, signInWithGoogle, user } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("iyasmzn07@gmail.com")
  const [password, setPassword] = useState("asdasd")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault()
    try {
      await signIn(email, password)
      router.push("/app/home") // redirect after login
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle()
    } catch (err: any) {
      toast.error(err.message)
    }
  }
  
  useEffect(() => {
    if (user) {
      console.log("User already logged in, redirecting to home")
      console.log(user)
      router.push("/app/home") // redirect langsung jika sudah login
    }
  }, [user, router])
  
  if (user) return null
  
  return (
    <div className="max-w-md mx-auto p-4 flex flex-col gap-2">
      {loading && <LoadingOverlay />}
      <h1 className="text-xl font-bold mb-2">Login</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border rounded p-2"/>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="border rounded p-2"/>
        <div className="grid grid-cols-2 gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
          <Link href="/signup" className="text-center bg-red-600 text-white px-4 py-2 rounded">Sign Up</Link>
        </div>
      </form>

      <div className="flex items-center gap-2 my-2">
        <span className="flex-1 border-t"></span>
        <span className="text-gray-500">or</span>
        <span className="flex-1 border-t"></span>
      </div>

      <button onClick={handleGoogleLogin} className="bg-yellow-600 text-white px-4 py-2 rounded">
        Login with Google
      </button>
    </div>
  )
}
