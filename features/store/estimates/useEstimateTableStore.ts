import { create } from "zustand"

// ─── Types ───────────────────────────────────────────────────────────────────

interface EstimateTableStore {
  currentPage: number
  setCurrentPage: (page: number | ((prev: number) => number)) => void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useEstimateTableStore = create<EstimateTableStore>((set) => ({
  currentPage: 1,
  setCurrentPage: (page) =>
    set((state) => ({
      currentPage: typeof page === "function" ? page(state.currentPage) : page,
    })),
}))
