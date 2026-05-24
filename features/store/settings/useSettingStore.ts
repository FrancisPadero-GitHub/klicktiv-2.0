import { create } from "zustand"

// ─── Types ───────────────────────────────────────────────────────────────────

export type SettingsTab =
  | "payment-methods"
  | "review-types"
  | "profiles"
  | "update-information"

type SettingsStore = {
  activeTab: SettingsTab
  setActiveTab: (tab: SettingsTab) => void
}

// ─── Store ────────────────────────────────────────────────────────────────────

// Persists the active settings tab across panel re-mounts.
export const useSettingsStore = create<SettingsStore>((set) => ({
  activeTab: "payment-methods",
  setActiveTab: (tab: SettingsTab) => set({ activeTab: tab }),
}))
