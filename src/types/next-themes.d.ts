declare module "next-themes" {
  import * as React from "react"

  export interface ThemeProviderProps {
    children: React.ReactNode
    attribute?: string
    defaultTheme?: string
    enableSystem?: boolean
    storageKey?: string
    themes?: string[]
    value?: Record<string, string>
  }

  export const ThemeProvider: React.FC<ThemeProviderProps>

  export function useTheme(): {
    theme: string | undefined
    setTheme: (theme: string) => void
    resolvedTheme: string | undefined
    systemTheme: "dark" | "light" | undefined
  }
}
