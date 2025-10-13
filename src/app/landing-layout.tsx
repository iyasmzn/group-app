import type { Metadata } from "next";
import "@/styles/global.css";
import { NavbarDemo } from "@/components/navbar-demo";

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
      <NavbarDemo />
      <main className="px-4 py-6">{children}</main>
    </>
  );
}