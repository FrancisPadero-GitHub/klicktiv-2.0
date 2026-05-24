import { create } from "zustand"
import dayjs from "@/lib/dayjs"

// ─── Types ───────────────────────────────────────────────────────────────────

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

// ─── Initial State ────────────────────────────────────────────────────────────

// Use local time for defaults so that year/month/date match the user's
// actual calendar day — not the UTC day which can lag behind by up to a day.
const nowLocal = dayjs()

const initialState: Omit<JobDateFilter, "technicianId"> = {
  mode: "year",
  year: nowLocal.year(),
  month: nowLocal.month() + 1, // dayjs months are 0-indexed (0-11)
  isoWeek: nowLocal.format("YYYY-[W]WW"),
  date: nowLocal.format("YYYY-MM-DD"),
  startDate: nowLocal.startOf("month").format("YYYY-MM-DD"),
  endDate: nowLocal.format("YYYY-MM-DD"),
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useJobFilterStore = create<JobsFilterState>()((set) => ({
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

  setPreset: (mode, overrides) => set((state) => ({ ...state, mode, ...overrides })),

  reset: () => {
    // Generate a fresh 'now' so resets don't use stale data if the tab is left open.
    const freshNow = dayjs()
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
    technicianId: filter.technicianId === "all" ? undefined : filter.technicianId,
  }
}
