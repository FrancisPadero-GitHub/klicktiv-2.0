"use client"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { usePathname } from "next/navigation"
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Kbd } from "@/components/ui/kbd"

// import FeedbackPage from "../submit-feedback/feedback-page";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  MessageSquareText,
  Users,
  Settings,
  LogOut,
  Loader2,
} from "lucide-react"

// store
import { useSidebarStore } from "@/features/store/dashboard/useSidebarStore"

// hooks
import { useLogout } from "@/hooks/authentication/useLogout"
import { useEffect } from "react"

// public
import KlicktivLogoLightMode from "@/public/kt_logo_name.png"
import KlicktivLogoDarkMode from "@/public/kt_logo_name_dark.png"
import KlicktivIconLightMode from "@/public/icon.png"
import KlicktivIconDarkMode from "@/public/icon_dark.png"

// These are the sidebar navigation items.
export const navItems = [
  { href: "/dashboard", label: "Overview / Reports", icon: LayoutDashboard },
  { href: "/dashboard/jobs", label: "Jobs", icon: Briefcase },
  { href: "/dashboard/estimates", label: "Estimates", icon: FileText },
  { href: "/dashboard/reviews", label: "Reviews", icon: MessageSquareText },
  {
    href: "/dashboard/technicians",
    label: "Technicians",
    icon: Users,
    adminOnly: true, // The `adminOnly` property indicates if the item should only be visible to admin users.
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
  },
]

interface SidebarContentProps {
  user: { email?: string | null } | null
  userRole: string | null
  company: string
  /** When true, the sidebar is in desktop icon-only (rail) mode */
  collapsed?: boolean
}

export default function SidebarContent({
  user,
  userRole,
  company,
  collapsed = false,
}: SidebarContentProps) {
  const { sidebarState, setSidebarState } = useSidebarStore()
  const pathname = usePathname()
  const { mutate: logout, isPending, isError, error } = useLogout()
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  // Admins can see all nav items; non-admins have some items hidden
  // and are redirected if they try to access those routes handled by proxy.ts middleware.
  const isAdmin = userRole === "company" || userRole === "super_admin"

  // derive visible nav items directly — cheap filter, no state needed
  const visibleNavItems = navItems.filter((item) => !item.adminOnly || isAdmin)

  const logoutHandler = () => {
    logout()
    // routes are handled by the proxy.ts middleware which will redirect to the login page on successful logout.
  }

  useEffect(() => {
    if (isError) {
      console.error("Logout failed:", error)
      alert("Logout failed: " + (error as Error).message)
    }
  }, [isError, error])

  return (
    <>
      {/* Logo / Header */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-sidebar-border transition-all duration-100",
          "justify-center px-2"
        )}
      >
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
          {/* Icon only (for collapsed sidebar) */}
          <div
            className={cn(
              "absolute flex items-center justify-center transition-all duration-200 ease-in-out",
              collapsed
                ? "h-15 w-15 scale-100 opacity-100"
                : "pointer-events-none h-8 w-8 scale-90 opacity-0"
            )}
          >
            <Tooltip>
              <TooltipTrigger>
                <Image
                  src={KlicktivIconLightMode}
                  alt="Klicktiv Logo"
                  width={2048}
                  height={2048}
                  className="dark:hidden"
                  priority
                  quality={100}
                />
                <Image
                  src={KlicktivIconDarkMode}
                  alt="Klicktiv Logo"
                  width={2048}
                  height={2048}
                  className="hidden dark:block"
                  priority
                  quality={100}
                />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Press <Kbd>D</Kbd> to toggle between light & dark mode
              </TooltipContent>
            </Tooltip>
          </div>
          {/* Full logo (icon + text) */}
          <div
            className={cn(
              // for some reason if you remove this pt-2 the logo will corner so much up top and do not center, and no items and justify center
              // wont do either
              "absolute flex pt-2 transition-all duration-200 ease-in-out",
              !collapsed
                ? "h-auto w-25 scale-90 opacity-100"
                : "pointer-events-none h-auto w-25 scale-90 opacity-0"
            )}
          >
            <Tooltip>
              <TooltipTrigger>
                <Image
                  src={KlicktivLogoLightMode}
                  alt="Klicktiv Logo"
                  width={1672}
                  height={941}
                  className="dark:hidden"
                  priority
                  quality={100}
                />
                <Image
                  src={KlicktivLogoDarkMode}
                  alt="Klicktiv Logo"
                  width={1672}
                  height={941}
                  className="hidden dark:block"
                  priority
                  quality={100}
                />
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Press <Kbd>D</Kbd> to toggle between light & dark mode
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        {visibleNavItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              onClick={() => {
                if (sidebarState === "expand") {
                  setSidebarState("collapse")
                }
              }}
              className={cn(
                "flex h-10 items-center overflow-hidden rounded-md text-sm font-medium transition-all duration-100",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex w-12 shrink-0 items-center justify-center">
                <Icon className="h-4 w-4 shrink-0" />
              </div>
              <span
                className={cn(
                  "truncate whitespace-nowrap transition-all duration-100 ease-in-out",
                  collapsed
                    ? "pointer-events-none w-0 opacity-0"
                    : "flex-1 opacity-100"
                )}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Feedback — hide label when collapsed */}
      <div className="px-2 pb-2">
        {/* <FeedbackPage>
          <button
            title={collapsed ? "Submit Feedback" : undefined}
            className={cn(
              "flex w-full items-center rounded-md text-sm font-medium text-muted-foreground cursor-pointer transition-all duration-100 hover:bg-muted hover:text-foreground h-10 overflow-hidden",
            )}
          >
            <div className="flex w-12 shrink-0 items-center justify-center">
              <MessageSquareText className="h-4 w-4 shrink-0" />
            </div>
            <span
              className={cn(
                "truncate transition-all duration-100 ease-in-out whitespace-nowrap",
                collapsed
                  ? "w-0 opacity-0 pointer-events-none"
                  : "flex-1 opacity-100 text-left",
              )}
            >
              Submit Feedback
            </span>
          </button>
        </FeedbackPage> */}
      </div>

      {/* User & Logout */}
      <div className="space-y-2 border-t border-sidebar-border p-2">
        {user && (
          <div
            className="flex h-12 items-center overflow-hidden rounded-md px-0"
            title={collapsed ? (user.email ?? undefined) : undefined}
          >
            <div className="flex w-12 shrink-0 items-center justify-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                {(user.email?.[0] ?? "?").toUpperCase()}
              </div>
            </div>
            <div
              className={cn(
                "min-w-0 flex-1 transition-all duration-100 ease-in-out",
                collapsed
                  ? "pointer-events-none w-0 opacity-0"
                  : "w-auto opacity-100"
              )}
            >
              <p className="truncate text-xs leading-tight font-semibold text-accent-foreground">
                {company}
              </p>
              <p className="mt-0.5 truncate text-xs leading-tight text-muted-foreground">
                {user.email || "Something went wrong"}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsAlertOpen(true)}
          disabled={isPending}
          title={collapsed ? "Log out" : undefined}
          className={cn(
            "flex h-10 w-full cursor-pointer items-center overflow-hidden rounded-md text-sm font-medium text-muted-foreground transition-all duration-100 hover:bg-muted hover:text-foreground disabled:opacity-60"
          )}
        >
          <div className="flex w-12 shrink-0 items-center justify-center">
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4 shrink-0" />
            )}
          </div>
          <span
            className={cn(
              "truncate whitespace-nowrap transition-all duration-100 ease-in-out",
              collapsed
                ? "pointer-events-none w-0 opacity-0"
                : "flex-1 text-left opacity-100"
            )}
          >
            Log out
          </span>
        </button>
        {/* Logout alert dialog to double confirm to avoid misclicks */}
        <AlertDialog open={isAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm log out</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to log out?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={() => logoutHandler()}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  )
}
