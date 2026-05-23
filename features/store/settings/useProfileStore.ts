import { create } from "zustand";
import type { ProfilesRow } from "@/hooks/auth/useFetchProfiles";
import { devtools } from "zustand/middleware";

/**
 * Steps to create a proper store
 *
 * 1. Shape of the store (interface)
 * 2. Mutations of the store (interface)
 * 3. Type of the store: Combine 1 & 2
 * 4. Set default values of the form
 * 5. Set initial value of the store (including the functions) (Profiuule )
 */

// Extends the type first cause password and command is not in the types in Profiles row
export type ExtendedProfilesRow = ProfilesRow & {
  password?: string | null;
  command?: string;
};

type mode = "add" | "edit";

// Shape of the store
interface ProfileState {
  form: ExtendedProfilesRow;
  isViewDialogOpen: boolean;
  formType: mode;
  isFormDialogOpen: boolean;
}

// Mutations of the store
interface ProfileActions {
  setForm: (data: Partial<ExtendedProfilesRow>) => void; // Partial is a requiement also for the edge functions since I also use the dynamic objects there
  resetForm: () => void;

  // View dialog actions
  setViewDialogOpen: (open: boolean) => void;
  // Form dialog actions
  setFormDialogOpen: (open: boolean) => void;
  setFormType: (data: mode) => void;
}

// Combines both for the full store type
type ProfileStore = ProfileState & ProfileActions;

// Default Values
export const defaultFormValues: ExtendedProfilesRow = {
  id: "",
  company_id: "", // required both id and company for the check on the edge function
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
};

// Initial State
const initialState: ProfileState = {
  form: defaultFormValues,
  isViewDialogOpen: false,
  formType: "add",
  isFormDialogOpen: false,
};

// 5. Corrected Middleware Setup
// Note the extra () before the middleware - this is crucial for TS inference
export const useProfileStore = create<ProfileStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setForm: (data) =>
        set(
          (state) => ({ form: { ...state.form, ...data } }),
          false,
          "profile/setForm",
        ),

      resetForm: () =>
        set({ form: defaultFormValues }, false, "profile/resetForm"),

      setViewDialogOpen: (open) =>
        set({ isViewDialogOpen: open }, false, "profile/setViewDialogOpen"),

      // sets the state to add or edit to be able to dynamically adjust the texts on the dialog
      setFormType: (type) =>
        set({ formType: type }, false, "profile/setFormType"),

      // doesn't matter what type of these are actually here I think cause both opens up a dialog anyways
      setFormDialogOpen: (open) =>
        set({ isFormDialogOpen: open }, false, "profile/setFormDialogOpen"),
    }),
    { name: "Profile Store" },
  ),
);
