import dayjs from "@/lib/dayjs"

export const TIMEZONE_STORAGE_KEY = "klicktiv-timezone"

export const TIMEZONE_OPTIONS = [
  { value: "America/New_York", label: "Tampa, Florida" },
  { value: "America/Chicago", label: "Chicago, Illinois" },
  { value: "America/Denver", label: "Denver, Colorado" },
  { value: "America/Los_Angeles", label: "Los Angeles, California" },
  { value: "America/Mexico_City", label: "Mexico City, Mexico" },
  { value: "America/Sao_Paulo", label: "São Paulo, Brazil" },
  { value: "America/Toronto", label: "Toronto, Canada" },
  { value: "Europe/London", label: "London, United Kingdom" },
  { value: "Europe/Paris", label: "Paris, France" },
  { value: "Europe/Berlin", label: "Berlin, Germany" },
  { value: "Europe/Madrid", label: "Madrid, Spain" },
  { value: "Europe/Rome", label: "Rome, Italy" },
  { value: "Europe/Moscow", label: "Moscow, Russia" },
  { value: "Africa/Johannesburg", label: "Johannesburg, South Africa" },
  { value: "Asia/Tokyo", label: "Tokyo, Japan" },
  { value: "Asia/Shanghai", label: "Shanghai, China" },
  { value: "Asia/Kolkata", label: "Kolkata, India" },
  { value: "Asia/Dubai", label: "Dubai, United Arab Emirates" },
  { value: "Australia/Sydney", label: "Sydney, Australia" },
  { value: "Pacific/Auckland", label: "Auckland, New Zealand" },
] as const

// type
export type SupportedTimezone = (typeof TIMEZONE_OPTIONS)[number]["value"]

const supportedTimezoneValues = new Set(
  TIMEZONE_OPTIONS.map((option) => option.value)
)

export function getBrowserTimezone() {
  return dayjs.tz.guess()
}

export function isSupportedTimezone(
  timezone: string | null | undefined
): timezone is SupportedTimezone {
  return (
    !!timezone && supportedTimezoneValues.has(timezone as SupportedTimezone)
  )
}

// Resolve timezone from explicit value first, then from local storage.
export function resolveTimezone(timezone?: string | null) {
  if (isSupportedTimezone(timezone)) return timezone

  if (typeof window === "undefined") return getBrowserTimezone()

  const storedTimezone = window.localStorage.getItem(TIMEZONE_STORAGE_KEY)
  if (isSupportedTimezone(storedTimezone)) return storedTimezone

  return getBrowserTimezone()
}

export function saveTimezone(timezone: string | null) {
  if (typeof window === "undefined") return
  if (!timezone) {
    window.localStorage.removeItem(TIMEZONE_STORAGE_KEY)
    return
  }

  window.localStorage.setItem(TIMEZONE_STORAGE_KEY, timezone)
}

export function getTimezoneLabel(timezone: string) {
  return (
    TIMEZONE_OPTIONS.find((option) => option.value === timezone)?.label ??
    timezone
  )
}
