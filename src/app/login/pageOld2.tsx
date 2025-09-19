import { login, signup } from "./actions"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"


export default async function LoginPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (data && data.user) {
    redirect('/app/home')
  }
  const user = data.user
  
  if (user) return null

  return (
    <div className="max-w-md mx-auto p-4 flex flex-col gap-2">
      <h1 className="text-xl font-bold mb-2">Login</h1>
      {/* {error && <p className="text-red-600">{error}</p>} */}

      <form className="flex flex-col gap-2">
        <input type="email" placeholder="Email" required className="border rounded p-2"/>
        <input type="password" placeholder="Password" required className="border rounded p-2"/>
        <div className="grid grid-cols-2 gap-2">
          <button formAction={login} className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
          <button formAction={signup} className="bg-blue-600 text-white px-4 py-2 rounded">Sign Up</button>
        </div>
      </form>

      <div className="flex items-center gap-2 my-2">
        <span className="flex-1 border-t"></span>
        <span className="text-gray-500">or</span>
        <span className="flex-1 border-t"></span>
      </div>

      <button className="bg-red-600 text-white px-4 py-2 rounded">
        Login with Google
      </button>
    </div>
  )
}