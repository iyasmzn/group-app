import React from "react"
import "@testing-library/jest-dom"
import { vi } from "vitest"

// Mock next/image
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}))

// Mock AvatarImage dari shadcn/ui
vi.mock("@/components/ui/avatar", async (importOriginal) => {
  const actual = (await importOriginal()) as Record<string, unknown>
  return {
    ...actual,
    AvatarImage: (props: any) => <img {...props} />,
  }
})

// Polyfill window.matchMedia untuk next-themes
if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}
