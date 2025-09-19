"use client"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/supabaseAuth"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const { signIn, signInWithGoogle, user } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signIn(email, password)
      router.push("/app/home") // redirect after login
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle()
    } catch (err: any) {
      setError(err.message)
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
      <h1 className="text-xl font-bold mb-2">Login</h1>
      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border rounded p-2"/>
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="border rounded p-2"/>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
      </form>

      <div className="flex items-center gap-2 my-2">
        <span className="flex-1 border-t"></span>
        <span className="text-gray-500">or</span>
        <span className="flex-1 border-t"></span>
      </div>

      <button onClick={handleGoogleLogin} className="bg-red-600 text-white px-4 py-2 rounded">
        Login with Google
      </button>
    </div>
  )
}
