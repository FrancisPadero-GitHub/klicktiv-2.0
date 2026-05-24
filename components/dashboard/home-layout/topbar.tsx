// import SidebarNotification from "@/components/dashboard/notifications/sidebar-notification"
"use client"
import { useSidebarStore } from "@/features/store/dashboard/useSidebarStore"
import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

// clock
import { TopbarClock } from "./topbar-clock"

function Topbar() {
  const {
    sidebarState,
    setSidebarState,
    desktopCollapsed,
    setDesktopCollapsed,
  } = useSidebarStore()

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card pr-6 pl-6">
      <div className="">
        {/* Desktop toggle — visible lg+ */}
        <button
          title="Toggle sidebar"
          onClick={() => setDesktopCollapsed(!desktopCollapsed)}
          className="hidden cursor-pointer items-center justify-center rounded-md text-accent-foreground/90 transition-colors not-first:text-muted-foreground hover:bg-accent hover:text-accent-foreground/50 lg:flex"
          aria-label="Toggle sidebar"
        >
          {desktopCollapsed === true ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeftOpen className="h-5 w-5" />
          )}
        </button>

        {/* Mobile toggle — visible below lg */}
        <button
          title="Toggle sidebar"
          onClick={() =>
            setSidebarState(sidebarState === "expand" ? "collapse" : "expand")
          }
          className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground lg:hidden"
          aria-label="Toggle mobile sidebar"
        >
          {sidebarState === "expand" ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeftOpen className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2">
        <TopbarClock />
        {/* <SidebarNotification />
        <ModeToggle /> */}
      </div>
    </header>
  )
}

export default Topbar
