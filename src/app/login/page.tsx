'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import LoadingOverlay from '@/components/loading-overlay'
import { toast } from 'sonner'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Mail, Lock, Chrome, Home } from 'lucide-react'
import Image from 'next/image'
import Reveal from '@/components/animations/Reveal'
import { ModeToggle } from '@/components/mode-toggle'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const { signIn, signInWithGoogle, user } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('grimsbyoloyo@gmail.com')
  const [password, setPassword] = useState('grimsbyolo')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault()
    try {
      await signIn(email, password)
      router.push('/app/home')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  useEffect(() => {
    if (user) {
      router.push('/app/home')
    }
  }, [user, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-600 to-cyan-400 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors">
      {loading && <LoadingOverlay />}
      <Reveal animation="fadeInUp" delay={0.1} className="flex justify-center w-full">
        <Card className="w-full max-w-md shadow-lg border border-border bg-card text-card-foreground backdrop-blur-md">
          <CardHeader className="flex flex-col items-center gap-4">
            {/* Logo */}
            <Reveal animation="fadeIn" delay={0.15}>
              <Image
                src="/assets/logo.png"
                alt="Logo"
                width={64}
                height={64}
                className="rounded-lg"
              />
            </Reveal>

            {/* Title + Actions */}
            <div className="flex w-full items-center justify-between">
              <CardTitle className="text-xl font-bold">Login</CardTitle>
              <div className="flex items-center gap-2">
                <Link href="/" title="Back to Home">
                  <Button variant="outline" size="icon">
                    <Home className="h-4 w-4" />
                  </Button>
                </Link>
                <ModeToggle />
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <Reveal animation="fadeInUp" delay={0.3}>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="submit"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Login
                  </Button>
                  <Link href="/signup" className="w-full">
                    <Button variant="destructive" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </form>
            </Reveal>

            <Reveal animation="fadeIn" delay={0.4}>
              <div className="flex items-center gap-2">
                <span className="flex-1 border-t border-border" />
                <span className="text-muted-foreground text-sm">atau</span>
                <span className="flex-1 border-t border-border" />
              </div>
            </Reveal>

            <Reveal animation="fadeInUp" delay={0.5}>
              <Button
                onClick={handleGoogleLogin}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <Chrome className="h-5 w-5 text-red-500" /> Login dengan Google
              </Button>
            </Reveal>
          </CardContent>

          <CardFooter className="text-center text-sm text-muted-foreground">
            <Reveal animation="fadeIn" delay={0.6}>
              © {new Date().getFullYear()} Group App
            </Reveal>
          </CardFooter>
        </Card>
      </Reveal>
    </div>
  )
}
