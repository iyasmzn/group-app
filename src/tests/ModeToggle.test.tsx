import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { renderWithProviders } from "@/tests/utils"
import { ModeToggle } from "@/components/mode-toggle"
import { describe, expect, it } from "vitest"

describe("ModeToggle", () => {
  it("renders toggle button", () => {
    renderWithProviders(<ModeToggle />)
    expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument()
  })

  it("can open dropdown and select dark theme", async () => {
    renderWithProviders(<ModeToggle />)

    const trigger = screen.getByRole("button", { name: /toggle theme/i })
    await userEvent.click(trigger)

    // tunggu sampai aria-expanded berubah
    await waitFor(() => {
        expect(trigger).toHaveAttribute("aria-expanded", "true")
    })

    // sekarang cari menuitem
    const darkItem = await screen.findByRole("menuitem", { name: /dark/i })
    await userEvent.click(darkItem)

    expect(document.documentElement.classList.contains("dark")).toBe(true)
    })


  it("can switch back to light theme", async () => {
    renderWithProviders(<ModeToggle />)

    const trigger = screen.getByRole("button", { name: /toggle theme/i })
    await userEvent.click(trigger)

    const lightItem = await screen.findByRole("menuitem", { name: /light/i })
    await userEvent.click(lightItem)

    expect(document.documentElement.classList.contains("dark")).toBe(false)
  })
})