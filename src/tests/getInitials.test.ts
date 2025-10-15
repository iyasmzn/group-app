import { getInitials } from "@/lib/utils/format"
import { describe, it, expect } from "vitest"

describe("getInitials", () => {
  it("handles single word with max=2", () => {
    expect(getInitials("ALICE")).toBe("AL")
    expect(getInitials("Alice")).toBe("Al")
    expect(getInitials("aLice")).toBe("aL")
  })

  it("handles multiple words", () => {
    expect(getInitials("John Doe")).toBe("JD")
    expect(getInitials("john doe")).toBe("jd")
    expect(getInitials("john DOE")).toBe("jD")
  })

  it("respects preserveCase=false", () => {
    expect(getInitials("john doe", 2, false)).toBe("JD")
    expect(getInitials("alice", 2, false)).toBe("AL")
  })

  it("returns ? for empty input", () => {
    expect(getInitials("")).toBe("?")
  })
})