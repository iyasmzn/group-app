import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Group App - Manage Groups & Chat",
  description: "Create groups, chat in real-time, and assign dynamic roles with flexible permissions.",
  openGraph: {
    title: "Group App - Manage Groups & Chat",
    description: "Create groups, chat in real-time, and assign dynamic roles with flexible permissions.",
    url: "https://yourdomain.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Group App - Manage Groups & Chat",
    description: "Create groups, chat in real-time, and assign dynamic roles with flexible permissions.",
  },
};

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <Navbar />
        <main className="px-4 py-6">{children}</main>
    </>
  );
}