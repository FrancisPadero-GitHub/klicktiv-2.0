import React from "react"

// wrappers
import { QueryProvider } from "./query-provider"
import { ThemeProvider } from "./theme-provider"
import { AuthContextProvider } from "./auth-context-provider"
import { TimezoneProvider } from "./timezone-provider"

// component ui wrappers
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"

interface ProvidersProps {
  children: React.ReactNode
}

/**
 * Instead of wrapping every page in the app with the same layout, we can wrap the
 * layout with providers that should be common across all pages.
 * This ensures that the context is available to all pages and components in the app, without having to
 * wrap each page individually. This is especially useful for things like theme providers,
 * authentication providers, or any other global state that needs to be accessible throughout the app.
 *
 */
function GlobalProvider({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <AuthContextProvider>
          <TimezoneProvider>
            <TooltipProvider>
              {children}
              <Toaster position="top-right" />
            </TooltipProvider>
          </TimezoneProvider>
        </AuthContextProvider>
      </ThemeProvider>
    </QueryProvider>
  )
}

export default GlobalProvider
