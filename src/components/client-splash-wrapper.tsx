"use client";

import dynamic from "next/dynamic";

const SplashScreen = dynamic(() => import("@/components/ui/splash-screen"), {
  ssr: false,
});

export default SplashScreen;