"use client"

import { Fragment, useEffect, useMemo, useState } from "react"
import dayjs from "@/lib/dayjs"
import { Clock, ChevronDown, RotateCcw } from "lucide-react"
import {
  PRIMARY_TIMEZONE_LOCATION_LABELS,
  TIMEZONE_OPTIONS,
  getBrowserTimezone,
} from "@/lib/timezone"
import { useTimezone } from "@/components/providers/timezone-provider"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function TopbarClock() {
  const [now, setNow] = useState(dayjs())
  const [pendingTimezone, setPendingTimezone] = useState<string | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const { timezone, timezoneLabel, setTimezone } = useTimezone()

  const groupedTimezoneOptions = useMemo(() => {
    const groups = new Map<
      (typeof TIMEZONE_OPTIONS)[number]["primaryLocation"],
      Array<(typeof TIMEZONE_OPTIONS)[number]>
    >()

    for (const option of TIMEZONE_OPTIONS) {
      const existingGroup = groups.get(option.primaryLocation)
      if (existingGroup) {
        existingGroup.push(option)
      } else {
        groups.set(option.primaryLocation, [option])
      }
    }

    return Array.from(groups.entries())
  }, [])

  const pendingTimezoneLabel = pendingTimezone
    ? (TIMEZONE_OPTIONS.find((option) => option.value === pendingTimezone)
        ?.label ?? pendingTimezone)
    : `Browser timezone (${getBrowserTimezone()})`

  const requestTimezoneChange = (nextTimezone: string | null) => {
    if ((nextTimezone ?? null) === timezone) return

    setPendingTimezone(nextTimezone)
    setIsConfirmOpen(true)
  }

  const confirmTimezoneChange = () => {
    setTimezone(pendingTimezone)
    setIsConfirmOpen(false)
    setPendingTimezone(null)
    // Experimental where it refresh the router to apply the changes in the following:
    // 1. Dashboard Date filters
    window.location.reload()
  }

  useEffect(() => {
    const i = setInterval(() => {
      setNow(dayjs().tz())
    }, 1000)

    return () => clearInterval(i)
  }, [])

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur transition-colors hover:bg-muted/70"
            aria-label="Change timezone"
          >
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="hidden text-muted-foreground sm:inline">
              {now.tz(timezone).format("MMM D")}
            </span>
            <span className="font-mono text-foreground">
              {now.tz(timezone).format("hh:mm:ss A")}
            </span>
            <span className="hidden text-muted-foreground md:inline">
              {timezoneLabel}
            </span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuLabel>Timezone</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={timezone}
            onValueChange={(value) => requestTimezoneChange(value)}
          >
            {groupedTimezoneOptions.map(([primaryLocation, options]) => (
              <Fragment key={primaryLocation}>
                <DropdownMenuLabel className="text-[11px] tracking-wide text-muted-foreground uppercase">
                  {PRIMARY_TIMEZONE_LOCATION_LABELS[primaryLocation]}
                </DropdownMenuLabel>
                {options.map((option) => (
                  <DropdownMenuRadioItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </Fragment>
            ))}
          </DropdownMenuRadioGroup>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => requestTimezoneChange(null)}
            className="gap-2"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Use browser timezone ({getBrowserTimezone()})
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Change timezone?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              Switch to {pendingTimezoneLabel}?
              <br />
              <span className="inline-block pt-1">
                If date sync issues occurs, please reload / refresh the page.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingTimezone(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmTimezoneChange}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
