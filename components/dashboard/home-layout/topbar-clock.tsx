"use client"

import { useEffect, useState } from "react"
import dayjs from "@/lib/dayjs"
import { Clock, ChevronDown, RotateCcw } from "lucide-react"
import { TIMEZONE_OPTIONS, getBrowserTimezone } from "@/lib/timezone"
import { useTimezone } from "@/components/timezone-provider"
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
  const { timezone, timezoneLabel, setTimezone } = useTimezone()

  useEffect(() => {
    const i = setInterval(() => {
      setNow(dayjs())
    }, 1000)

    return () => clearInterval(i)
  }, [])

  return (
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
          onValueChange={(value) => setTimezone(value)}
        >
          <DropdownMenuLabel className="text-[11px] tracking-wide text-muted-foreground uppercase">
            United States
          </DropdownMenuLabel>
          {TIMEZONE_OPTIONS.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTimezone(null)} className="gap-2">
          <RotateCcw className="h-3.5 w-3.5" />
          Use browser timezone ({getBrowserTimezone()})
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
