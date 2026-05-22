"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import relativeTime from "dayjs/plugin/relativeTime"

// Configure Day.js globally with required plugins
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)

// Define Zustand state for the timezone store
interface TimezoneState {
  timezone: string
  savedTimezones: string[]
  setTimezone: (tz: string) => void
  addSavedTimezone: (tz: string) => void
  removeSavedTimezone: (tz: string) => void
}

// Store that persists selection to localStorage
const useTimezoneStore = create<TimezoneState>()(
  persist(
    (set) => ({
      timezone: "UTC", // Default safe server fallback
      savedTimezones: [
        "UTC",
        "America/New_York",
        "Europe/London",
        "Asia/Tokyo",
        "Asia/Singapore",
        "Australia/Sydney"
      ],
      setTimezone: (tz: string) => set({ timezone: tz }),
      addSavedTimezone: (tz: string) =>
        set((state) => ({
          savedTimezones: state.savedTimezones.includes(tz)
            ? state.savedTimezones
            : [...state.savedTimezones, tz],
        })),
      removeSavedTimezone: (tz: string) =>
        set((state) => ({
          savedTimezones: state.savedTimezones.filter((t) => t !== tz),
        })),
    }),
    {
      name: "klicktiv-timezone-settings",
    }
  )
)

const TimezoneContext = createContext<{
  isMounted: boolean
} | null>(null)

/**
 * Context Provider that wraps the application to avoid Next.js hydration issues.
 * Prevents mismatch warnings by ensuring components render with the client-hydrated timezone only after mounting.
 */
export function TimezoneProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Detect system browser timezone and set it if still set to the default UTC
    const currentStore = useTimezoneStore.getState()
    if (currentStore.timezone === "UTC") {
      try {
        const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone
        if (browserTz) {
          useTimezoneStore.setState({ timezone: browserTz })
        }
      } catch (error) {
        console.warn("Could not determine browser's timezone, defaulting to UTC:", error)
      }
    }
    setIsMounted(true)
  }, [])

  return (
    <TimezoneContext.Provider value={{ isMounted }}>
      {children}
    </TimezoneContext.Provider>
  )
}

/**
 * Custom React Hook that provides:
 * - timezone: The active IANA timezone string
 * - savedTimezones: The user's list of favorite/quick-switch timezones
 * - setTimezone: Switch the current active timezone
 * - addSavedTimezone / removeSavedTimezone: Manage the user's favorite list
 * - isHydrated: Whether the store is mounted on the client
 * - dayjs: Helper that returns a dayjs instance scoped to the active timezone
 * - formatDate: Direct formatting helper
 * - convertToTimezone: Helper to convert dates between timezones
 * - getCurrentTime: Get current time locked to the timezone
 */
export function useTimezone() {
  const context = useContext(TimezoneContext)
  const store = useTimezoneStore()

  // Avoid Next.js SSR hydration issues by checking mount status
  const isMounted = context ? context.isMounted : false
  const activeTimezone = isMounted ? store.timezone : "UTC"

  // Returns a Day.js instance set to the active timezone
  const tzDayjs = (date?: dayjs.ConfigType) => {
    return dayjs(date).tz(activeTimezone)
  }

  // Format a date in the active timezone
  const formatDate = (
    date: dayjs.ConfigType,
    formatStr: string = "YYYY-MM-DD HH:mm:ss Z"
  ) => {
    return dayjs(date).tz(activeTimezone).format(formatStr)
  }

  // Convert any date to a target timezone
  const convertToTimezone = (
    date: dayjs.ConfigType,
    targetTz: string,
    formatStr?: string
  ) => {
    const converted = dayjs(date).tz(targetTz)
    return formatStr ? converted.format(formatStr) : converted
  }

  // Get the current time in the active timezone
  const getCurrentTime = (formatStr?: string) => {
    const now = dayjs().tz(activeTimezone)
    return formatStr ? now.format(formatStr) : now
  }

  return {
    timezone: activeTimezone,
    savedTimezones: isMounted ? store.savedTimezones : ["UTC"],
    setTimezone: store.setTimezone,
    addSavedTimezone: store.addSavedTimezone,
    removeSavedTimezone: store.removeSavedTimezone,
    isHydrated: isMounted,
    dayjs: tzDayjs,
    formatDate,
    convertToTimezone,
    getCurrentTime,
  }
}
