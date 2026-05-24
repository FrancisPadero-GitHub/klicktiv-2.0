import { create } from "zustand"

// ─── Types ───────────────────────────────────────────────────────────────────

interface JobTableStore {
  currentPage: number
  setCurrentPage: (page: number | ((prev: number) => number)) => void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useJobTableStore = create<JobTableStore>((set) => ({
  currentPage: 1,
  setCurrentPage: (page) =>
    set((state) => ({
      currentPage: typeof page === "function" ? page(state.currentPage) : page,
    })),
}))
