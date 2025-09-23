"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface SplashScreenProps {
  duration?: number;
  children: React.ReactNode;
}

export default function SplashScreen({ duration = 2000, children }: SplashScreenProps) {
  const [showSplash, setShowSplash] = useState(true);
  const [durationDone, setDurationDone] = useState(false);
  const [swRegistered, setSwRegistered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDurationDone(true), duration);

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => {
          console.log("✅ Service Worker registered");
          setSwRegistered(true);
        })
        .catch(() => setSwRegistered(true));
    } else {
      setSwRegistered(true);
    }

    return () => clearTimeout(timer);
  }, [duration]);

  useEffect(() => {
    if (durationDone && swRegistered) {
      setShowSplash(false);
    }
  }, [durationDone, swRegistered]);

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-400 z-[9999]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-none shadow-lg p-6">
              <CardContent className="flex flex-col items-center space-y-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={100}
                    height={100}
                    className="rounded-full"
                  />
                </motion.div>
                <motion.h1
                  className="text-white text-2xl font-bold"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  Group App
                </motion.h1>
                <motion.p
                  className="text-white/80 text-sm"
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

      {/* Render children hanya setelah splash hilang */}
      {!showSplash && children}
    </>
  );
}