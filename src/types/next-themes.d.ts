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
}
