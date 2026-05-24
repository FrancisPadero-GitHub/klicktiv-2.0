import { create } from "zustand"
import { devtools } from "zustand/middleware"
import type { ProfilesRow } from "@/hooks/profiles/useFetchProfiles"

// ─── Types ───────────────────────────────────────────────────────────────────

// Extends the base type since password and command are not part of ProfilesRow.
export type ExtendedProfilesRow = ProfilesRow & {
  password?: string | null
  command?: string
}

type FormMode = "add" | "edit"

// Shape of the store
interface ProfileState {
  form: ExtendedProfilesRow
  isViewDialogOpen: boolean
  formType: FormMode
  isFormDialogOpen: boolean
}

// Mutations of the store
interface ProfileActions {
  // Partial is required for edge functions that accept dynamic objects.
  setForm: (data: Partial<ExtendedProfilesRow>) => void
  resetForm: () => void
  setViewDialogOpen: (open: boolean) => void
  setFormDialogOpen: (open: boolean) => void
  setFormType: (data: FormMode) => void
}

type ProfileStore = ProfileState & ProfileActions

// ─── Defaults ─────────────────────────────────────────────────────────────────

export const defaultFormValues: ExtendedProfilesRow = {
  id: "",
  company_id: "", // required for edge function checks
  avatar_url: null,
  created_at: null,
  email: null,
  password: null,
  f_name: null,
  l_name: null,
  role: null,
  updated_at: null,
  username: null,
  website: null,
  command: "update",
  deleted_at: null,
}

// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: ProfileState = {
  form: defaultFormValues,
  isViewDialogOpen: false,
  formType: "add",
  isFormDialogOpen: false,
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useProfileStore = create<ProfileStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setForm: (data) =>
        set(
          (state) => ({ form: { ...state.form, ...data } }),
          false,
          "profile/setForm"
        ),

      resetForm: () =>
        set({ form: defaultFormValues }, false, "profile/resetForm"),

      setViewDialogOpen: (open) =>
        set({ isViewDialogOpen: open }, false, "profile/setViewDialogOpen"),

      // Sets the mode to dynamically adjust dialog texts.
      setFormType: (type) =>
        set({ formType: type }, false, "profile/setFormType"),

      setFormDialogOpen: (open) =>
        set({ isFormDialogOpen: open }, false, "profile/setFormDialogOpen"),
    }),
    { name: "Profile Store" }
  )
)
