"use client"
// React hooks and types used to provide timezone state to the app.
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

// Helpers for resolving, persisting and labeling timezones.
import {
  getTimezoneLabel,
  resolveTimezone,
  saveTimezone,
  TIMEZONE_STORAGE_KEY,
} from "@/lib/timezone"

// Shape of the timezone context value exposed to consumers.
type TimezoneContextValue = {
  timezone: string
  timezoneLabel: string
  setTimezone: (timezone: string | null) => void
}

// Context instance for providing timezone info across the app.
const TimezoneContext = createContext<TimezoneContextValue | undefined>(
  undefined
)

export function TimezoneProvider({ children }: { children: ReactNode }) {
  // Local React state holding the current timezone identifier.
  // Initialized from persisted value or browser default via `resolveTimezone()`.
  const [timezone, setTimezoneState] = useState(() => resolveTimezone())

  // Persist timezone to storage whenever it changes.
  useEffect(() => {
    saveTimezone(timezone)
  }, [timezone])

  // Listen for `storage` events so multiple tabs stay in sync when timezone changes.
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === TIMEZONE_STORAGE_KEY) {
        // Update state from the new storage value (if provided).
        setTimezoneState(resolveTimezone(event.newValue))
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  // Memoize the context value so consumers only re-render when `timezone` changes.
  const value = useMemo<TimezoneContextValue>(
    () => ({
      timezone,
      // Human-friendly label for the current timezone.
      timezoneLabel: getTimezoneLabel(timezone),
      // Setter exposed to consumers: persists then updates local state.
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
  // Hook for consuming timezone context; throws if used outside provider.
  const context = useContext(TimezoneContext)
  if (!context) {
    throw new Error("useTimezone must be used within a TimezoneProvider")
  }

  return context
}
