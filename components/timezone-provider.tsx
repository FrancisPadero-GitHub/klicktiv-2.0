"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import {
  getTimezoneLabel,
  resolveTimezone,
  saveTimezone,
  TIMEZONE_STORAGE_KEY,
} from "@/lib/timezone"

type TimezoneContextValue = {
  timezone: string
  timezoneLabel: string
  setTimezone: (timezone: string | null) => void
}

const TimezoneContext = createContext<TimezoneContextValue | undefined>(
  undefined
)

export function TimezoneProvider({ children }: { children: ReactNode }) {
  // Keep timezone in React state so every visible date rerenders after switch.
  const [timezone, setTimezoneState] = useState(() => resolveTimezone())

  useEffect(() => {
    saveTimezone(timezone)
  }, [timezone])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === TIMEZONE_STORAGE_KEY) {
        setTimezoneState(resolveTimezone(event.newValue))
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  const value = useMemo<TimezoneContextValue>(
    () => ({
      timezone,
      timezoneLabel: getTimezoneLabel(timezone),
      setTimezone: (nextTimezone) => {
        saveTimezone(nextTimezone)
        setTimezoneState(resolveTimezone(nextTimezone))
      },
    }),
    [timezone]
  )

  return (
    <TimezoneContext.Provider value={value}>
      {children}
    </TimezoneContext.Provider>
  )
}

export function useTimezone() {
  const context = useContext(TimezoneContext)
  if (!context) {
    throw new Error("useTimezone must be used within a TimezoneProvider")
  }

  return context
}
