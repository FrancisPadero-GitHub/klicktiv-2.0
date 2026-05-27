"use client"
import { cn } from "@/lib/utils"

// hooks
import { useFetchCompany } from "@/hooks/company/useFetchCompany"

// components
import SidebarContent from "@/components/dashboard/layout/sidebar-contents"
import { useAuth } from "@/components/providers/auth-context-provider"
import Topbar from "@/components/dashboard/layout/topbar"
import Loading from "@/components/loading-styles/dashboard-loading-skeleton"

// zustand
import { useSidebarStore } from "@/features/store/dashboard/useSidebarStore"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Sidebar state
  const { sidebarState, setSidebarState, desktopCollapsed } = useSidebarStore()

  // Auth to determine which nav items to show and whether to allow access to certain routes
  const { user, role, company_id, isFetching: isRoleFetching } = useAuth()

  // fetches the company_id for the current user and displays it in the sidebar.
  const comp_id =
    typeof company_id === "string" && company_id ? company_id : undefined
  const { data: company } = useFetchCompany(comp_id)
  const companyName = company?.name || "No Company"

  return (
    <div>
      {isRoleFetching ? (
        <div>
          <Loading />
        </div>
      ) : (
        <div className="fixed inset-0 flex bg-background">
          {/* Desktop Sidebar */}
          <aside
            className={cn(
              "hidden flex-col overflow-hidden border-r border-sidebar-border bg-sidebar transition-[width] duration-300 ease-in-out will-change-[width] lg:flex",
              desktopCollapsed ? "w-16" : "w-60"
            )}
          >
            <SidebarContent
              user={user}
              userRole={role}
              company={companyName}
              collapsed={desktopCollapsed}
            />
          </aside>

          {/* Mobile Sidebar Overlay: This is for the dimming the background when the sidebar is open and provides close sidebar when clicked */}
          {sidebarState === "expand" && (
            <div
              className="fixed inset-0 z-40 bg-black/30 lg:hidden"
              onClick={() => setSidebarState("collapse")}
            />
          )}

          {/* Mobile Sidebar Drawer */}
          <aside
            className={cn(
              "fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:hidden",
              sidebarState === "expand" ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <SidebarContent
              user={user}
              userRole={role}
              company={companyName}
              collapsed={false}
            />
          </aside>

          {/* Main */}
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            {/* Top bar */}
            <Topbar />
            <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-background p-6">
              {/* Main Content with Children */}
              {children}
            </main>
          </div>
        </div>
      )}
    </div>
  )
}
