import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

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

export const navItems = [
  { href: "/dashboard", label: "Overview / Reports", icon: LayoutDashboard },
  { href: "/dashboard/jobs", label: "Jobs", icon: Briefcase },
  { href: "/dashboard/estimates", label: "Estimates", icon: FileText },
  { href: "/dashboard/reviews", label: "Reviews", icon: MessageSquareText },
  {
    href: "/dashboard/technicians",
    label: "Technicians",
    icon: Users,
    adminOnly: true,
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
  },
]

interface SidebarContentProps {
  companyName: string
  pathname: string
  visibleNavItems: typeof navItems
  user: { email?: string | null } | null
  company: string
  /** When true, the sidebar is in desktop icon-only (rail) mode */
  collapsed?: boolean
}

export default function SidebarContent({
  // companyName,
  pathname,
  visibleNavItems,
  user,
  company,
  collapsed = false,
}: SidebarContentProps) {
  const { sidebarState, setSidebarState } = useSidebarStore()
  const { mutate: logout, isPending, isError, error } = useLogout()

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
        <div className="relative flex h-full w-full items-center justify-center">
          {/* <span
            className={cn(
              "absolute top-4 left-28 z-99 text-[9px] font-bold uppercase tracking-widest text-accent-foreground truncate",
              collapsed ? "hidden" : "",
            )}
          >
            {companyName || "No Company"}
          </span> */}
          <Image
            src="/kt_logo_only.png"
            title="Klicktiv"
            alt="Klicktiv Logo"
            width={60}
            height={60}
            className={cn(
              "teal-dark:invert teal-dark:mix-blend-screen absolute object-contain transition-all duration-300 dark:mix-blend-screen dark:invert",
              collapsed
                ? "scale-150 opacity-100"
                : "pointer-events-none scale-75 opacity-0"
            )}
            style={{ width: "auto", height: "auto" }}
            priority
          />
          <Image
            src="/kt_logo_name.png"
            title="Klicktiv Dashboard"
            alt="Klicktiv Logo"
            width={90}
            height={40}
            className={cn(
              "teal-dark:invert teal-dark:mix-blend-screen w-auto transition-all duration-100 dark:mix-blend-screen dark:invert",
              !collapsed
                ? "scale-90 opacity-100"
                : "pointer-events-none scale-75 opacity-0"
            )}
            style={{ width: "auto", height: "auto" }}
            priority
          />
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
          onClick={() => logoutHandler()}
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
      </div>
    </>
  )
}
