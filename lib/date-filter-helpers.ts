import dayjs from "@/lib/dayjs"
import { formatDateWithTimezone } from "./timezone"

//
export function getISOWeekRange(isoWeekStr: string, timezone?: string | null) {
  const match = isoWeekStr.match(/^(\d{4})-W(\d{2})$/)
  if (!match) return null
  
  const year = Number(match[1])
  const week = Number(match[2])

  // Base the date targeting the specific year and ISO week
  let startOfWeek = dayjs().utc().year(year).isoWeek(week).startOf('isoWeek')

  // Apply timezone if provided, keeping the local time intact
  if (timezone) {
    startOfWeek = startOfWeek.tz(timezone, true)
  }

  const endOfWeek = startOfWeek.endOf('isoWeek')

  return {
    start: formatDateWithTimezone(startOfWeek.toDate(), "MMM D", timezone),
    end: formatDateWithTimezone(endOfWeek.toDate(), "MMM D, YYYY", timezone),
  }
}

/** Resolve a descriptive label for the current dashboard filter */
export function resolveFilterLabel(opts: {
  mode: string
  year: number
  month: number // Assumes 1-indexed (1 = Jan, 12 = Dec)
  isoWeek: string
  date: string
  startDate: string
  endDate: string
  technicianName?: string
  timezone?: string | null
}): string {
  let datePart = ""

  switch (opts.mode) {
    case "all":
      datePart = "All Time"
      break

    case "year":
      datePart = `Year ${opts.year}`
      break

    case "month":
      // dayjs expects 0-indexed months (0 = Jan), so we subtract 1 from a 1-indexed input
      datePart = dayjs().month(opts.month - 1).year(opts.year).format("MMM YYYY")
      break

    case "week": {
      const range = getISOWeekRange(opts.isoWeek, opts.timezone)
      datePart = range ? `${range.start} to ${range.end}` : opts.isoWeek
      break
    }

    case "day":
      datePart = formatDateWithTimezone(opts.date, "MMM D, YYYY", opts.timezone)
      break

    case "range": {
      const startStr = opts.startDate
        ? formatDateWithTimezone(opts.startDate, "MMM D", opts.timezone)
        : "start"
      const endStr = opts.endDate
        ? formatDateWithTimezone(opts.endDate, "MMM D, YYYY", opts.timezone)
        : "end"
      datePart = `${startStr} to ${endStr}`
      break
    }

    default:
      datePart = "Current Filter"
  }

  const techPart =
    opts.technicianName &&
    opts.technicianName !== "all" &&
    opts.technicianName !== "All Technicians"
      ? ` | Tech: ${opts.technicianName}`
      : ""

  return `${datePart}${techPart}`
}
