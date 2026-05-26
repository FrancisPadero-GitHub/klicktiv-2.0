import { create } from "zustand"
import dayjs from "@/lib/dayjs"
import { resolveTimezone } from "@/lib/timezone"

/**
 * This store is used for dashboard KPI's filter and export paramaters for the RPC functions
 * USAGE:
 *  1. dashboard KPI's in overview and jobs page
 *  2. arguments for the excel and pdf exports
 */

export type DateFilterMode = "all" | "year" | "month" | "week" | "day" | "range"
export interface JobDateFilter {
  mode: DateFilterMode
  /** Selected year for "year" or "month" modes */
  year: number
  /** 1-based month for "month" mode */
  month: number
  /** ISO week string e.g. "2026-W09" for "week" mode */
  isoWeek: string
  /** ISO date string e.g. "2026-03-01" for "day" mode */
  date: string
  /** ISO date string for range start */
  startDate: string
  /** ISO date string for range end */
  endDate: string
  /** UUID of the selected technician, or "all" for no filter */
  technicianId: string | null
}
interface JobsFilterState extends JobDateFilter {
  setMode: (mode: DateFilterMode) => void
  setYear: (year: number) => void
  setMonth: (month: number) => void
  setIsoWeek: (isoWeek: string) => void
  setDate: (date: string) => void
  setStartDate: (startDate: string) => void
  setEndDate: (endDate: string) => void
  setTechnicianId: (technicianId: string) => void
  setPreset: (mode: DateFilterMode, overrides?: Partial<JobDateFilter>) => void
  reset: () => void
}

/**
 * To change
 * set this to timezone preference for default values
 * to eliminate the consfusion between dates shown
 *
 * ps: do not convert the data passing on the arguments to any hook or function to fetch data like
 * rpc or view tables since its already pre configured value for the timezone the user selected
 */

// Create 'now' using the user's selected timezone (or browser default).
// We resolve the timezone here instead of using a React hook so the store
// can initialize correctly outside of component render scope.
const timezone = dayjs().tz(resolveTimezone())

console.log("useDashboardKpiDateFilters", timezone)

const initialState: Omit<JobDateFilter, "technicianId"> = {
  mode: "year",
  year: timezone.year(),
  month: timezone.month() + 1, // dayjs months are 0-indexed (0-11)
  isoWeek: timezone.format("YYYY-[W]WW"),
  date: timezone.format("YYYY-MM-DD"),
  startDate: timezone.startOf("month").format("YYYY-MM-DD"),
  endDate: timezone.format("YYYY-MM-DD"),
}

export const useDashboardKpiDateFilters = create<JobsFilterState>()((set) => ({
  ...initialState,
  technicianId: "all",

  setMode: (mode) => set({ mode }),
  setYear: (year) => set({ year }),
  setMonth: (month) => set({ month }),
  setIsoWeek: (isoWeek) => set({ isoWeek }),
  setDate: (date) => set({ date }),
  setStartDate: (startDate) => set({ startDate }),
  setEndDate: (endDate) => set({ endDate }),
  setTechnicianId: (technicianId) => set({ technicianId }),

  setPreset: (mode, overrides) =>
    set((state) => ({ ...state, mode, ...overrides })),

  reset: () => {
    // Generate a fresh 'now' so resets don't use stale data if the tab is left open.
    const freshNow = dayjs().tz(resolveTimezone())
    set({
      mode: "year",
      year: freshNow.year(),
      month: freshNow.month() + 1,
      isoWeek: freshNow.format("YYYY-[W]WW"),
      date: freshNow.format("YYYY-MM-DD"),
      startDate: freshNow.startOf("month").format("YYYY-MM-DD"),
      endDate: freshNow.format("YYYY-MM-DD"),
      technicianId: "all",
    })
  },
}))

/**
 * Convert the store's filter state into the shape expected by fetch hooks.
 */
export function toJobsSummaryFilter(filter: JobDateFilter) {
  return {
    mode: filter.mode,
    year: filter.year,
    month: filter.month,
    isoWeek: filter.isoWeek,
    date: filter.date,
    startDate: filter.startDate,
    endDate: filter.endDate,
    technicianId:
      filter.technicianId === "all" ? undefined : filter.technicianId,
  }
}
