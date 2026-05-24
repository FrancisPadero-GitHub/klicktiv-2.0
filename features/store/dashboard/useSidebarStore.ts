import { create } from "zustand"

// ─── Types ───────────────────────────────────────────────────────────────────

export type SidebarState = "collapse" | "expand"

export type SidebarStore = {
  /** Mobile drawer open/closed state */
  sidebarState: SidebarState
  setSidebarState: (state: SidebarState) => void
  /** Desktop sidebar icon-only (collapsed) state */
  desktopCollapsed: boolean
  setDesktopCollapsed: (collapsed: boolean) => void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useSidebarStore = create<SidebarStore>((set) => ({
  sidebarState: "collapse",
  setSidebarState: (state: SidebarState) => set({ sidebarState: state }),
  desktopCollapsed: false,
  setDesktopCollapsed: (collapsed: boolean) => set({ desktopCollapsed: collapsed }),
}))
