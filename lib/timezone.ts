import dayjs from "@/lib/dayjs"

export const TIMEZONE_STORAGE_KEY = "klicktiv-timezone"

export const TIMEZONE_OPTIONS = [
  {
    value: "America/New_York",
    label: "Tampa, Florida",
    primaryLocation: "America",
  },
  {
    value: "America/Chicago",
    label: "Chicago, Illinois",
    primaryLocation: "America",
  },
  {
    value: "America/Denver",
    label: "Denver, Colorado",
    primaryLocation: "America",
  },
  {
    value: "America/Los_Angeles",
    label: "Los Angeles, California",
    primaryLocation: "America",
  },
  {
    value: "America/Mexico_City",
    label: "Mexico City, Mexico",
    primaryLocation: "America",
  },
  {
    value: "America/Sao_Paulo",
    label: "São Paulo, Brazil",
    primaryLocation: "America",
  },
  {
    value: "America/Toronto",
    label: "Toronto, Canada",
    primaryLocation: "America",
  },
  {
    value: "Europe/London",
    label: "London, United Kingdom",
    primaryLocation: "Europe",
  },
  {
    value: "Europe/Paris",
    label: "Paris, France",
    primaryLocation: "Europe",
  },
  {
    value: "Europe/Berlin",
    label: "Berlin, Germany",
    primaryLocation: "Europe",
  },
  {
    value: "Europe/Madrid",
    label: "Madrid, Spain",
    primaryLocation: "Europe",
  },
  {
    value: "Europe/Rome",
    label: "Rome, Italy",
    primaryLocation: "Europe",
  },
  {
    value: "Europe/Moscow",
    label: "Moscow, Russia",
    primaryLocation: "Europe",
  },
  {
    value: "Africa/Johannesburg",
    label: "Johannesburg, South Africa",
    primaryLocation: "Africa",
  },
  {
    value: "Asia/Tokyo",
    label: "Tokyo, Japan",
    primaryLocation: "Asia",
  },
  {
    value: "Asia/Shanghai",
    label: "Shanghai, China",
    primaryLocation: "Asia",
  },
  {
    value: "Asia/Kolkata",
    label: "Kolkata, India",
    primaryLocation: "Asia",
  },
  {
    value: "Asia/Dubai",
    label: "Dubai, United Arab Emirates",
    primaryLocation: "Asia",
  },
  {
    value: "Australia/Sydney",
    label: "Sydney, Australia",
    primaryLocation: "Australia",
  },
  {
    value: "Pacific/Auckland",
    label: "Auckland, New Zealand",
    primaryLocation: "Pacific",
  },
] as const

export type SupportedTimezone = (typeof TIMEZONE_OPTIONS)[number]["value"]
export type PrimaryTimezoneLocation =
  (typeof TIMEZONE_OPTIONS)[number]["primaryLocation"]

export const PRIMARY_TIMEZONE_LOCATION_LABELS: Record<
  PrimaryTimezoneLocation,
  string
> = {
  America: "Americas",
  Europe: "Europe",
  Africa: "Africa",
  Asia: "Asia",
  Australia: "Australia",
  Pacific: "Pacific",
}

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

/** Resolve timezone from an explicit value first, then from localStorage. */
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

// Date formatter with timezone
// This is used for formatting stored date like
// formatDateWithTimezone(weekStart, "MMM D", timezone), or something similar

export function formatDateWithTimezone(
  value: Date | string,
  format: string,
  timezone?: string | null
) {
  if (timezone) {
    return dayjs.utc(value).tz(timezone, true).format(format)
  }

  return dayjs.utc(value).format(format)
}
