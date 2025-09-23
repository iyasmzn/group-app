import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/supabase/auth"
import { Toaster } from "@/components/ui/sonner";
import RegisterSW from "@/components/register-sw";
import SplashScreen from "@/components/client-splash-wrapper";

export const metadata: Metadata = {
  title: "Group App",
  description: "Aplikasi manajemen group",
  manifest: "/manifest.json",
  icons: {
    icon: "/vercel.svg",
    apple: "/vercel.svg"
  }

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <SplashScreen duration={1500}>
              <main>{children}</main>
              <Toaster position="top-center" />
              <RegisterSW />
            </SplashScreen>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
