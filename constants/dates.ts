import type { DateFilterMode } from "@/features/store/shared/useDashboardKpiDateFilters";

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

// types the mode key
export const PRESET_BUTTONS: { mode: DateFilterMode; label: string }[] = [
  { mode: "all", label: "All Time" },
  { mode: "year", label: "Year" },
  { mode: "month", label: "Month" },
  { mode: "week", label: "Week" },
  { mode: "day", label: "Day" },
  { mode: "range", label: "Range" },
]
