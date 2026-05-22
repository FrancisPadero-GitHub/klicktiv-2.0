"use client"

import React, { useState } from "react"
import { useTimezone } from "@/hooks/useTimezone"
import { TimezoneSelector } from "@/components/ui/timezone-selector"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  CalendarDays, 
  ArrowRightLeft, 
  Code2, 
  Activity, 
  Info,
  Clock,
  Sparkles,
  RefreshCw
} from "lucide-react"

// Sample dynamic database / event timestamps in UTC
const GLOBAL_EVENTS = [
  { id: 1, title: "Daily Sync Meeting", utcTime: "2026-05-22T09:00:00Z" },
  { id: 2, title: "Global Dev Standup", utcTime: "2026-05-22T13:30:00Z" },
  { id: 3, title: "Database Scheduled Backup", utcTime: "2026-05-22T22:00:00Z" },
  { id: 4, title: "Project Sprint Demo", utcTime: "2026-05-23T15:00:00Z" },
]

export default function OverviewPage() {
  const {
    timezone,
    dayjs,
    formatDate,
    convertToTimezone,
    getCurrentTime,
  } = useTimezone()

  // Input fields for custom verification
  const [testInput, setTestInput] = useState("2026-05-22T18:00") // Local/UTC date string
  const [testOutputTz, setTestOutputTz] = useState("UTC")
  const [demoOutput, setDemoOutput] = useState("")

  const handleTestConvert = () => {
    if (!testInput) return
    try {
      // Use Dayjs wrapper from our timezone hook to parse the test input
      // Convert it to the target timezone
      const parsedDate = dayjs(testInput)
      const converted = convertToTimezone(parsedDate, testOutputTz, "LLLL (Z)")
      setDemoOutput(converted.toString())
    } catch (err) {
      setDemoOutput("Invalid date input or timezone name")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-muted/20 p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-6">
          <div className="space-y-1.5">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl flex items-center gap-2">
              <Activity className="text-primary size-8 animate-pulse" /> Timezone Dashboard Demo
            </h1>
            <p className="text-muted-foreground text-sm max-w-2xl">
              Verify global state persistence, switcher mechanics, and seamless Day.js integrations. Use this workspace to verify input parsing and outputs.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider animate-pulse">
            <Sparkles className="size-3.5" /> Day.js Active
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Column 1: Timezone Switcher Widget */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-1.5">
              <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                <Clock className="size-4.5 text-primary" /> Settings & Swapper
              </h2>
              <p className="text-xs text-muted-foreground">
                Switch and save configurations in localStorage.
              </p>
            </div>
            <TimezoneSelector />
          </div>

          {/* Column 2: Conversions & Code Demo */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Live UTC Event Conversions */}
            <div className="rounded-2xl border border-border/80 bg-card/60 p-6 shadow-xl backdrop-blur-xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                  <CalendarDays className="size-5 text-primary" /> Global Events Scheduler
                </h3>
                <span className="text-xs text-muted-foreground font-mono">
                  Input: ISO UTC
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                These events are stored in UTC (e.g. database timestamps) and dynamically converted to your active timezone <strong>({timezone})</strong> using Day.js.
              </p>
              
              <div className="space-y-3.5 mt-4">
                {GLOBAL_EVENTS.map((event) => {
                  const localFormatted = formatDate(event.utcTime, "dddd, h:mm A")
                  const differenceText = dayjs(event.utcTime).fromNow()
                  return (
                    <div 
                      key={event.id}
                      className="group flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-background/80 hover:border-primary/20 transition-all duration-200"
                    >
                      <div className="space-y-1">
                        <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {event.title}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
                          <span>UTC:</span>
                          <span>{dayjs(event.utcTime).utc().format("HH:mm")}</span>
                          <span className="text-muted-foreground/30">•</span>
                          <span className="text-2xs font-sans text-muted-foreground">{differenceText}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-start md:items-end justify-center">
                        <span className="text-sm font-bold text-foreground">
                          {localFormatted}
                        </span>
                        <span className="text-2xs text-primary font-medium tracking-wide">
                          {timezone}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Custom Input Parsing & Swapping Demo */}
            <div className="rounded-2xl border border-border/80 bg-card/60 p-6 shadow-xl backdrop-blur-xl space-y-4">
              <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                <ArrowRightLeft className="size-5 text-primary" /> Live Timezone Swapper Tool
              </h3>
              <p className="text-xs text-muted-foreground">
                Enter any local date and convert it into a different target timezone instantly.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Enter Date/Time
                  </label>
                  <Input
                    type="datetime-local"
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    className="bg-background/40"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Target Timezone
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g. UTC, Asia/Singapore, America/New_York"
                      value={testOutputTz}
                      onChange={(e) => setTestOutputTz(e.target.value)}
                      className="bg-background/40 font-mono"
                    />
                    <Button onClick={handleTestConvert} size="icon" className="shrink-0">
                      <RefreshCw className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {demoOutput && (
                <div className="p-3.5 rounded-lg bg-primary/5 border border-primary/10 flex items-center gap-3">
                  <Info className="size-4.5 text-primary shrink-0" />
                  <div className="text-xs font-semibold text-foreground">
                    <span className="text-muted-foreground font-normal">Result:</span> {demoOutput}
                  </div>
                </div>
              )}
            </div>

            {/* Developer Code Guidelines */}
            <div className="rounded-2xl border border-border/80 bg-card/60 p-6 shadow-xl backdrop-blur-xl space-y-4">
              <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
                <Code2 className="size-5 text-primary" /> How to use in code
              </h3>
              <p className="text-xs text-muted-foreground">
                Copy and paste these clean patterns to utilize `useTimezone` elsewhere.
              </p>

              <div className="rounded-lg bg-black/80 p-4 border border-white/5 overflow-x-auto">
                <pre className="text-xs text-emerald-400 font-mono space-y-1">
                  <code>{`import { useTimezone } from "@/hooks/useTimezone"

function Component() {
  const { timezone, dayjs, formatDate } = useTimezone()

  // 1. Create a dayjs instance in the active timezone
  const date = dayjs("2026-05-22T08:00:00Z")

  // 2. Direct timezone formatting
  const formatted = formatDate(date, "YYYY-MM-DD hh:mm A")
  
  return (
    <div>
      <p>Active timezone: {timezone}</p>
      <p>Time in {timezone}: {formatted}</p>
    </div>
  )
}`}</code>
                </pre>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
