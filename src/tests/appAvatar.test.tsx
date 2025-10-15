import React from "react"

import { AppAvatar } from "@/components/ui/app-avatar"
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { renderWithProviders } from "./utils"

describe("AppAvatar", () => {
  it("renders initials when no image provided", () => {
    render(<AppAvatar name="Alice Wonderland" />)
    // fallback harus muncul
    expect(screen.getByText("AW")).toBeInTheDocument()
  })

  it("renders first 2 letters if single word", () => {
    render(<AppAvatar name="Alice" />)
    expect(screen.getByText("Al")).toBeInTheDocument()
  })

  it("renders image when provided", () => {
    render(<AppAvatar name="Alice" image="https://example.com/avatar.png" />)
    const img = screen.getByAltText("Alice")
    expect(img).toHaveAttribute("src", "https://example.com/avatar.png")
  })

  it("shows status indicator when status is online", () => {
    render(<AppAvatar name="Alice" status="online" />)
    const status = screen.getByRole("status")
    expect(status).toHaveClass("bg-green-500")
  })

  it("renders avatar with theme context", () => {
    renderWithProviders(<AppAvatar name="Alice" image="https://example.com/a.png" />)
    expect(screen.getByAltText("Alice")).toBeInTheDocument()
  })

})