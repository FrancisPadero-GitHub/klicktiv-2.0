"use client"
import { useMemo, useState } from "react"
import {
  Calendar,
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  UserRound,
} from "lucide-react"
import dayjs from "@/lib/dayjs"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Calendar as CalendarPicker } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// store
import { useDashboardKpiDateFilters } from "@/features/store/shared/useDashboardKpiDateFilters"

// components
// import { DashboardExportButton } from "@/components/dashboard/dashboard-export-button"

// wrappers
import { useTimezone } from "@/components/providers/timezone-provider"

// helpers
import { resolveFilterLabel } from "@/lib/date-filter-helpers"
import { MONTHS, PRESET_BUTTONS } from "@/constants/dates"

// hooks
import { useFetchTechnicians } from "@/hooks/technicians/useFetchTechnicians"

// Replaced the manual native Date logic with a clean dayjs formatter
// this only formats. This does not change any date or timezone
// used for the store.
const toISODate = (d: Date) => dayjs(d).format("YYYY-MM-DD")

/**
 * Generates an array of years from the next calendar year down to 2020.
 * * @returns {number[]} Array of years in descending order.
 */
const yearOptions = (): number[] => {
  // Get the current year using dayjs instead of the native Date object
  const currentYear = dayjs().year()

  const years: number[] = []

  // Loop starts from next year (currentYear + 1) and decrements down to 2020
  for (let y = currentYear + 1; y >= 2020; y--) {
    years.push(y)
  }

  return years
}

export function DashboardDateFilter() {
  const store = useDashboardKpiDateFilters()
  const { data: technicianList } = useFetchTechnicians()
  const { timezone } = useTimezone()

  const [dayOpen, setDayOpen] = useState(false)
  const [startOpen, setStartOpen] = useState(false)
  const [endOpen, setEndOpen] = useState(false)

  const filterSummary = useMemo(() => {
    return resolveFilterLabel({
      mode: store.mode,
      year: store.year,
      month: store.month,
      isoWeek: store.isoWeek,
      date: store.date,
      startDate: store.startDate,
      endDate: store.endDate,
      timezone,
      technicianName: technicianList?.find((t) => t.id === store.technicianId)
        ?.name,
    })
  }, [
    store.mode,
    store.year,
    store.month,
    store.isoWeek,
    store.date,
    store.startDate,
    store.endDate,
    timezone,
    store.technicianId,
    technicianList,
  ])

  const navigatePrev = () => {
    if (store.mode === "year") {
      store.setYear(store.year - 1)
    } else if (store.mode === "month") {
      if (store.month === 1) {
        store.setYear(store.year - 1)
        store.setMonth(12)
      } else store.setMonth(store.month - 1)
    } else if (store.mode === "week") {
      const match = store.isoWeek.match(/^(\d{4})-W(\d{2})$/)
      if (match) {
        let y = Number(match[1]),
          w = Number(match[2]) - 1
        if (w < 1) {
          y -= 1
          w = 52
        }
        store.setIsoWeek(`${y}-W${String(w).padStart(2, "0")}`)
      }
    } else if (store.mode === "day") {
      // the utc here is only used for the day math and is not influencing any timezone shifts
      const prevDay = dayjs
        .utc(store.date)
        .subtract(1, "day")
        .format("YYYY-MM-DD")
      store.setDate(prevDay)
    }
  }

  const navigateNext = () => {
    if (store.mode === "year") {
      store.setYear(store.year + 1)
    } else if (store.mode === "month") {
      if (store.month === 12) {
        store.setYear(store.year + 1)
        store.setMonth(1)
      } else store.setMonth(store.month + 1)
    } else if (store.mode === "week") {
      const match = store.isoWeek.match(/^(\d{4})-W(\d{2})$/)
      if (match) {
        let y = Number(match[1]),
          w = Number(match[2]) + 1
        if (w > 52) {
          y += 1
          w = 1
        }
        store.setIsoWeek(`${y}-W${String(w).padStart(2, "0")}`)
      }
    } else if (store.mode === "day") {
      // the utc here is only used for the day math and is not influencing any timezone shifts
      const nextDay = dayjs.utc(store.date).add(1, "day").format("YYYY-MM-DD")
      store.setDate(nextDay)
    }
  }

  const showNav = store.mode !== "all" && store.mode !== "range"

  // Parse strings into local midnight dates specifically for the CalendarPicker UI
  const selectedDay = store.date ? dayjs(store.date).toDate() : undefined

  const selectedStart = store.startDate
    ? dayjs(store.startDate).toDate()
    : undefined

  const selectedEnd = store.endDate ? dayjs(store.endDate).toDate() : undefined

  return (
    <div className="space-y-3">
      {/* Mode Selector Row */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted p-1">
          {PRESET_BUTTONS.map(({ mode, label }) => (
            <button
              key={mode}
              onClick={() => store.setMode(mode)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                store.mode === mode
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {showNav && (
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon-xs" onClick={navigatePrev}>
              <ChevronLeft />
            </Button>
            <Button variant="outline" size="icon-xs" onClick={navigateNext}>
              <ChevronRight />
            </Button>
          </div>
        )}

        <Button
          variant="ghost"
          size="xs"
          onClick={store.reset}
          className="text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="size-3" />
          Reset
        </Button>
      </div>

      {/* Mode-specific controls */}
      <div className="flex flex-wrap items-end gap-3">
        {(store.mode === "year" || store.mode === "month") && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Year
            </label>
            <Select
              value={String(store.year)}
              onValueChange={(v) => store.setYear(Number(v))}
            >
              <SelectTrigger size="sm" className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {yearOptions().map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {store.mode === "month" && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Month
            </label>
            <Select
              value={String(store.month)}
              onValueChange={(v) => store.setMonth(Number(v))}
            >
              <SelectTrigger size="sm" className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m, i) => (
                  <SelectItem key={i} value={String(i + 1)}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {store.mode === "week" && (
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Week
            </label>
            <Input
              type="week"
              value={store.isoWeek}
              onChange={(e) => store.setIsoWeek(e.target.value)}
              className="h-8 w-44 text-sm"
            />
          </div>
        )}

        {/* Day — Popover Calendar */}
        {store.mode === "day" && (
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Date
            </label>
            <Popover open={dayOpen} onOpenChange={setDayOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 w-44 justify-between text-sm font-normal"
                >
                  {store.date
                    ? dayjs.utc(store.date).format("MMM D, YYYY")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <CalendarPicker
                  mode="single"
                  selected={selectedDay}
                  captionLayout="dropdown"
                  defaultMonth={selectedDay}
                  onSelect={(d) => {
                    if (d) {
                      store.setDate(toISODate(d))
                      setDayOpen(false)
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Range — two Popover Calendars */}
        {store.mode === "range" && (
          <>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                From
              </label>
              <Popover open={startOpen} onOpenChange={setStartOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-8 w-44 justify-between text-sm font-normal"
                  >
                    {store.startDate
                      ? dayjs.utc(store.startDate).format("MMM D, YYYY")
                      : "Start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <CalendarPicker
                    mode="single"
                    selected={selectedStart}
                    captionLayout="dropdown"
                    defaultMonth={selectedStart ?? new Date()}
                    onSelect={(d) => {
                      if (d) {
                        store.setStartDate(toISODate(d))
                        setStartOpen(false)
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                To
              </label>
              <Popover open={endOpen} onOpenChange={setEndOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-8 w-44 justify-between text-sm font-normal"
                  >
                    {store.endDate
                      ? dayjs.utc(store.endDate).format("MMM D, YYYY")
                      : "End date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <CalendarPicker
                    mode="single"
                    selected={selectedEnd}
                    captionLayout="dropdown"
                    defaultMonth={selectedEnd ?? new Date()}
                    onSelect={(d) => {
                      if (d) {
                        store.setEndDate(toISODate(d))
                        setEndOpen(false)
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </>
        )}

        {/* Technician Selector */}
        <div className="flex flex-col space-y-1">
          <label className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Technician
          </label>
          <Select
            value={store.technicianId || "all"}
            onValueChange={(v) => store.setTechnicianId(v)}
          >
            <SelectTrigger size="sm" className="w-48">
              <UserRound className="size-3.5 shrink-0 text-muted-foreground" />
              <SelectValue placeholder="All Technicians" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Technicians</SelectItem>
              {technicianList?.map((tech) => (
                <SelectItem key={tech.id} value={tech.id}>
                  {tech.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col space-y-1">
          {/* This was unrestricted
              now VA's have access to this one
          */}
          <div className="self-start">{/* <DashboardExportButton /> */}</div>
        </div>

        {/* Active filter summary badge */}
        <div className="flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1.5 text-xs font-medium text-muted-foreground">
          {store.mode === "range" ? (
            <CalendarRange className="size-3.5" />
          ) : store.mode === "day" ? (
            <Calendar className="size-3.5" />
          ) : (
            <CalendarDays className="size-3.5" />
          )}
          {filterSummary}
        </div>
      </div>
    </div>
  )
}
