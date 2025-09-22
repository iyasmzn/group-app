import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/supabase/auth"
import { Toaster } from "@/components/ui/sonner";

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
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <main className="px-4">{children}</main>
            <Toaster position="top-center" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
