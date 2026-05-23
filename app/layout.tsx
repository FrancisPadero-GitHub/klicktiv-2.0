import { Geist_Mono, Nunito_Sans } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

// Wrappers
import { QueryProvider } from "@/components/query-provider"
import { AuthProvider } from "@/components/auth-context-provider"
import { TimezoneProvider } from "@/components/timezone-provider"

// Components
import { Toaster } from "@/components/ui/sonner"

const nunitoSans = Nunito_Sans({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        nunitoSans.variable
      )}
    >
      <body>
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider>
              <Toaster position="top-right" />
              <TimezoneProvider>{children}</TimezoneProvider>
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
