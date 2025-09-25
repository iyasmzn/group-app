"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useTheme  } from "next-themes";
import { usePathname } from "next/navigation";

interface SplashScreenProps {
  duration?: number;
  children: React.ReactNode;
}

export default function SplashScreen({ duration = 2000, children }: SplashScreenProps) {
  const { theme, resolvedTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Deteksi halaman not-found / 404
  const isNotFoundPage =
    pathname?.includes("not-found") || pathname?.includes("404");

  // Pastikan komponen sudah mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Trigger splash setiap kali theme berubah, skip jika not-found
  useEffect(() => {
    if (!mounted || isNotFoundPage) {
      setShowSplash(false);
      return;
    }
    setShowSplash(true);
    const timer = setTimeout(() => setShowSplash(false), duration);
    return () => clearTimeout(timer);
  }, [theme, mounted, duration, isNotFoundPage]);

  // Render versi netral saat SSR
  if (!mounted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background text-foreground z-[9999]">
        <Card className="bg-card text-card-foreground border border-border shadow-lg p-6 backdrop-blur-md">
          <CardContent className="flex flex-col items-center space-y-4">
            <Image src="/assets/logo.png" alt="Logo" width={100} height={100} className="rounded-full" />
            <h1 className="text-2xl font-bold">Group App</h1>
            <p className="text-muted-foreground text-sm">Memuat aplikasi...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {showSplash && !isNotFoundPage && (
          <motion.div
            key={theme}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className={`fixed inset-0 flex items-center justify-center z-[9999] transition-colors
              ${theme === "dark" || resolvedTheme == 'dark'
                ? "bg-gradient-to-br from-gray-900 to-gray-800"
                : "bg-gradient-to-br from-blue-600 to-cyan-400"}
            `}
          >
            <Card className="bg-card text-card-foreground border border-border shadow-lg p-6 backdrop-blur-md transition-colors">
              <CardContent className="flex flex-col items-center space-y-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Image src="/assets/logo.png" alt="Logo" width={100} height={100} className="rounded-full" />
                </motion.div>
                <motion.h1
                  className="text-2xl font-bold"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  Group App
                </motion.h1>
                <motion.p
                  className="text-muted-foreground text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  Memuat aplikasi...
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!showSplash && children}
    </>
  );
}