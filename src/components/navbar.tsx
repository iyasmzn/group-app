"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  // Detect scroll for shadow effect
  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault()
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" })
    setIsOpen(false)
  }

  return (
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all backdrop-blur-md",
          isScrolled ? "shadow-md" : ""
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold hover:text-blue-600 transition-colors">
            Group App
          </Link>

          {/* Desktop menu */}
          <nav className="hidden md:flex gap-8 items-center">
            <a href="#home" onClick={(e) => handleSmoothScroll(e, "#home")} className="hover:text-blue-600">
              Home
            </a>
            <a href="#features" onClick={(e) => handleSmoothScroll(e, "#features")} className="hover:text-blue-600">
              Features
            </a>
            <a href="#contact" onClick={(e) => handleSmoothScroll(e, "#contact")} className="hover:text-blue-600">
              Contact
            </a>
            <ModeToggle />
            <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Get Started
            </Link>
          </nav>

          {/* Mobile button */}
          <button
            className="md:hidden p-2 rounded hover:bg-gray-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={cn(
            "md:hidden backdrop-blur-md overflow-hidden transition-all duration-300",
            isOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <nav className="flex flex-col p-4 space-y-3">
            <Link href="/" onClick={(e) => handleSmoothScroll(e, "#home")} className="hover:text-blue-600">
              Home
            </Link>
            <Link href="#features" onClick={(e) => handleSmoothScroll(e, "#features")} className="hover:text-blue-600">
              Features
            </Link>
            <Link href="#contact" onClick={(e) => handleSmoothScroll(e, "#contact")} className="hover:text-blue-600">
              Contact
            </Link>
            <ModeToggle />
            <Link href="/login" className="px-4 py-2 border rounded text-center hover:bg-blue-600 hover:text-white">
              Get Started
            </Link>
          </nav>
        </div>
      </header>
  )
}
