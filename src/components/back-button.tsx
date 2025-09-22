"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import Reveal from "./animations/Reveal"

export default function BackButton({ label }: { label?: string }) {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/") // fallback ke home
    }
  }

  return (
    
    <div className="flex items-center gap-2 mr-2">
      <Reveal animation="fadeIn">
        <button onClick={handleBack} className="text-sm text-primary flex items-center gap-1">
          <ChevronLeft className="w-6 h-6" />
          {
            label && <label>{label}</label>
          }
        </button>
      </Reveal>
    </div>
  )
}
