// app/layout.tsx
import type { Metadata } from 'next'
import '@/styles/global.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import RegisterSW from '@/components/register-sw'
import SplashScreen from '@/components/client-splash-wrapper'
import { QueryClientProviders } from '@/components/query-client-provider'
import { AuthProvider } from '@/context/AuthContext'
import { supabaseServer } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: 'Group App',
  description: 'Aplikasi manajemen group',
  manifest: '/manifest.json',
  icons: {
    icon: '/vercel.svg',
    apple: '/vercel.svg',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // 🔑 Ambil session dari server sebelum render
  const supabase = await supabaseServer()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryClientProviders>
            <AuthProvider initialSession={session}>
              <SplashScreen duration={1500}>
                <main>{children}</main>
                <Toaster position="top-center" />
                <RegisterSW />
              </SplashScreen>
            </AuthProvider>
          </QueryClientProviders>
        </ThemeProvider>
      </body>
    </html>
  )
}
