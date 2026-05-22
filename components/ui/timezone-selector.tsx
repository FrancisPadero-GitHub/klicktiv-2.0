"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useTimezone } from "@/hooks/useTimezone"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Globe, 
  Star, 
  Clock, 
  Search, 
  Check, 
  Plus, 
  X, 
  ChevronDown,
  Calendar,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"

// A curated list of common IANA timezones with labels
const POPULAR_TIMEZONES = [
  { value: "UTC", label: "Coordinated Universal Time (UTC)" },
  { value: "America/New_York", label: "New York / Eastern Time (ET)" },
  { value: "America/Chicago", label: "Chicago / Central Time (CT)" },
  { value: "America/Denver", label: "Denver / Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Los Angeles / Pacific Time (PT)" },
  { value: "America/Anchorage", label: "Anchorage / Alaska Time (AKT)" },
  { value: "America/Honolulu", label: "Honolulu / Hawaii Standard (HST)" },
  { value: "America/Sao_Paulo", label: "São Paulo / Brasilia Time (BRT)" },
  { value: "Europe/London", label: "London / Greenwich Mean Time (GMT/BST)" },
  { value: "Europe/Paris", label: "Paris / Central European Time (CET/CEST)" },
  { value: "Europe/Moscow", label: "Moscow Standard Time (MSK)" },
  { value: "Africa/Johannesburg", label: "Johannesburg / South African Time" },
  { value: "Asia/Dubai", label: "Dubai / Gulf Standard Time (GST)" },
  { value: "Asia/Kolkata", label: "India Standard Time (IST)" },
  { value: "Asia/Singapore", label: "Singapore Standard Time (SGT)" },
  { value: "Asia/Shanghai", label: "Beijing / China Standard Time (CST)" },
  { value: "Asia/Tokyo", label: "Tokyo / Japan Standard Time (JST)" },
  { value: "Australia/Sydney", label: "Sydney / Eastern Australian (AET)" },
  { value: "Pacific/Auckland", label: "Auckland / New Zealand Time (NZT)" },
]

export function TimezoneSelector() {
  const {
    timezone,
    savedTimezones,
    setTimezone,
    addSavedTimezone,
    removeSavedTimezone,
    isHydrated,
    getCurrentTime,
    formatDate,
  } = useTimezone()

  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTimeStr, setCurrentTimeStr] = useState("")
  const [currentDateStr, setCurrentDateStr] = useState("")
  const [customTimezone, setCustomTimezone] = useState("")
  const [customError, setCustomError] = useState("")

  // Update clock every second
  useEffect(() => {
    if (!isHydrated) return

    const updateClock = () => {
      try {
        setCurrentTimeStr(getCurrentTime("hh:mm:ss A") as string)
        setCurrentDateStr(getCurrentTime("dddd, MMMM D, YYYY") as string)
      } catch (err) {
        console.error("Clock update error", err)
      }
    }

    updateClock()
    const interval = setInterval(updateClock, 1000)
    return () => clearInterval(interval)
  }, [timezone, isHydrated, getCurrentTime])

  // Filter popular timezones based on search
  const filteredTimezones = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return POPULAR_TIMEZONES
    return POPULAR_TIMEZONES.filter(
      (tz) =>
        tz.value.toLowerCase().includes(query) ||
        tz.label.toLowerCase().includes(query)
    )
  }, [searchQuery])

  // Check if active timezone is in saved list
  const isCurrentSaved = useMemo(() => {
    return savedTimezones.includes(timezone)
  }, [savedTimezones, timezone])

  // Handle adding a custom timezone typed by the user
  const handleAddCustomTimezone = (e: React.FormEvent) => {
    e.preventDefault()
    const tz = customTimezone.trim()
    if (!tz) return

    try {
      // Validate timezone name using Intl
      Intl.DateTimeFormat(undefined, { timeZone: tz })
      addSavedTimezone(tz)
      setTimezone(tz)
      setCustomTimezone("")
      setCustomError("")
    } catch (err) {
      setCustomError("Invalid IANA Timezone name (e.g. Europe/Rome)")
    }
  }

  if (!isHydrated) {
    return (
      <div className="flex h-12 w-full animate-pulse items-center justify-between rounded-lg bg-muted px-4 py-2 text-sm text-muted-foreground">
        <span>Loading timezone settings...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-card/60 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:shadow-2xl">
      {/* Active Timezone Banner & Live Clock */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-5 border border-primary/10">
        <div className="absolute -right-6 -top-6 text-primary/5">
          <Globe className="size-24 animate-spin-slow" />
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="size-3.5" /> Active Timezone
            </div>
            <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              {timezone}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (isCurrentSaved) {
                    removeSavedTimezone(timezone)
                  } else {
                    addSavedTimezone(timezone)
                  }
                }}
                className={cn(
                  "size-8 rounded-full transition-transform active:scale-95",
                  isCurrentSaved ? "text-amber-500 hover:text-amber-600" : "text-muted-foreground hover:text-foreground"
                )}
                title={isCurrentSaved ? "Remove from favorites" : "Save to favorites"}
              >
                <Star className="size-4 fill-current" />
              </Button>
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              {currentDateStr || "Loading date..."}
            </p>
          </div>
          
          <div className="flex flex-col items-start md:items-end justify-center rounded-lg bg-background/50 px-4 py-2 border border-border/40 backdrop-blur-sm min-w-[150px]">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
              <Clock className="size-3.5 animate-pulse" /> Live Time
            </span>
            <span className="text-2xl font-mono font-bold tracking-tight text-primary">
              {currentTimeStr || "00:00:00 AM"}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Swapper List */}
      {savedTimezones.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Quick Switch Favorites
          </label>
          <div className="flex flex-wrap gap-2">
            {savedTimezones.map((tz) => (
              <div
                key={tz}
                className={cn(
                  "group flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium transition-all duration-200",
                  timezone === tz
                    ? "border-primary/50 bg-primary/10 text-primary shadow-sm shadow-primary/5"
                    : "border-border/60 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                )}
                onClick={() => setTimezone(tz)}
              >
                <span className="truncate max-w-[120px]">{tz.split("/").pop()?.replace("_", " ") || tz}</span>
                {timezone === tz && <Check className="size-3" />}
                {savedTimezones.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeSavedTimezone(tz)
                    }}
                    className="ml-1 rounded-full p-0.5 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all duration-150"
                    title="Remove favorite"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Select Trigger / Dropdown */}
      <div className="relative">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
          Select or Search Timezone
        </label>
        
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between h-11 border-border/80 bg-background/50 hover:bg-background/80 shadow-inner px-4 text-left font-normal"
        >
          <span className="flex items-center gap-2 truncate">
            <Globe className="size-4 text-muted-foreground animate-pulse" />
            <span className="truncate">{timezone}</span>
          </span>
          <ChevronDown className={cn("size-4 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")} />
        </Button>

        {isOpen && (
          <div className="absolute left-0 right-0 z-30 mt-2 rounded-xl border border-border bg-popover p-2 shadow-2xl animate-in fade-in-50 slide-in-from-top-3 duration-200">
            {/* Search Input */}
            <div className="relative flex items-center border-b border-border/60 pb-2 mb-2 px-1">
              <Search className="absolute left-3 size-4 text-muted-foreground" />
              <Input
                placeholder="Search world timezones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchQuery("")}
                  className="size-7 p-0 hover:bg-transparent"
                >
                  <X className="size-4 text-muted-foreground" />
                </Button>
              )}
            </div>

            {/* List */}
            <div className="max-h-60 overflow-y-auto px-1 space-y-0.5 scrollbar-thin">
              {filteredTimezones.length > 0 ? (
                filteredTimezones.map((tz) => (
                  <button
                    key={tz.value}
                    onClick={() => {
                      setTimezone(tz.value)
                      setIsOpen(false)
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm transition-colors duration-150",
                      timezone === tz.value
                        ? "bg-primary/10 text-primary font-semibold"
                        : "hover:bg-muted text-foreground/80 hover:text-foreground"
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{tz.value}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[280px]">
                        {tz.label}
                      </span>
                    </div>
                    {timezone === tz.value && <Check className="size-4" />}
                  </button>
                ))
              ) : (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No popular timezones found. Try custom entry below!
                </div>
              )}
            </div>

            {/* Backdrop Closer */}
            <div className="fixed inset-0 -z-10" onClick={() => setIsOpen(false)} />
          </div>
        )}
      </div>

      {/* Custom Timezone Entry Form */}
      <form onSubmit={handleAddCustomTimezone} className="border-t border-border/40 pt-4 mt-1">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
          Add Custom IANA Timezone
        </label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. Europe/Rome, Asia/Manila, America/Toronto"
            value={customTimezone}
            onChange={(e) => {
              setCustomTimezone(e.target.value)
              setCustomError("")
            }}
            className="h-10 border-border/80 bg-background/40"
          />
          <Button type="submit" className="h-10 px-4 shrink-0 gap-1.5">
            <Plus className="size-4" /> Add
          </Button>
        </div>
        {customError && (
          <p className="text-xs text-destructive mt-1.5 font-medium pl-1">
            {customError}
          </p>
        )}
      </form>
    </div>
  )
}
