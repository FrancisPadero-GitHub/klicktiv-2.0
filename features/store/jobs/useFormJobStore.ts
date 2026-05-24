import { create } from "zustand"
import type { Database } from "@/database.types"
import dayjs from "@/lib/dayjs"
import { resolveTimezone } from "@/lib/timezone"

// ─── Types ───────────────────────────────────────────────────────────────────

type FormMode = "add" | "edit"

export interface JobFormValues {
  work_order_id?: string
  work_title: string
  work_order_date: string
  technician_id: string
  address: string
  category: string
  description: string
  notes: string
  region: string
  contact_no: string
  contact_email: string
  subtotal: number
  parts_total_cost: number
  payment_method_id: string
  payment_method?: string | null
  status: Database["public"]["Enums"]["job_status_enum"]
  name: string
  tip_amount: number
  deposits: number
  payment_status: Database["public"]["Enums"]["payment_status"]
}

interface JobStore {
  form: JobFormValues
  mode: FormMode
  isDialogOpen: boolean
  isSubmitting: boolean
  openAdd: (timezone?: string) => void
  openEdit: (data: JobFormValues & { work_order_id: string }, timezone?: string) => void
  closeDialog: () => void
  resetForm: () => void
  setIsSubmitting: (value: boolean) => void
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

// Format helper for datetime-local inputs in the active timezone.
const getTimezoneLocalISOTime = (timezone?: string) =>
  dayjs().tz(resolveTimezone(timezone)).format("YYYY-MM-DDTHH:mm:ss")

export const defaultJobForm: JobFormValues = {
  work_order_id: undefined,
  work_title: "",
  work_order_date: "",
  technician_id: "",
  address: "",
  category: "",
  description: "",
  notes: "",
  region: "",
  contact_no: "",
  contact_email: "",
  subtotal: 0,
  parts_total_cost: 0,
  payment_method_id: "",
  payment_method: null,
  status: "pending",
  name: "",
  tip_amount: 0,
  deposits: 0,
  payment_status: "full",
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useJobStore = create<JobStore>((set) => ({
  form: { ...defaultJobForm },
  mode: "add",
  isDialogOpen: false,
  isSubmitting: false,

  openAdd: (timezone) =>
    set({
      form: {
        ...defaultJobForm,
        work_order_date: getTimezoneLocalISOTime(timezone),
      },
      mode: "add",
      isDialogOpen: true,
      isSubmitting: false,
    }),

  openEdit: (data, timezone) => {
    // Convert the incoming UTC date to the active timezone for the input.
    const localDate = data.work_order_date
      ? dayjs
          .utc(data.work_order_date)
          .tz(resolveTimezone(timezone))
          .format("YYYY-MM-DDTHH:mm:ss")
      : getTimezoneLocalISOTime(timezone)

    set({
      form: { ...data, work_order_date: localDate },
      mode: "edit",
      isDialogOpen: true,
      isSubmitting: false,
    })
  },

  closeDialog: () => set({ isDialogOpen: false }),

  resetForm: () =>
    set({
      form: { ...defaultJobForm },
      mode: "add",
      isSubmitting: false,
    }),

  setIsSubmitting: (value) => set({ isSubmitting: value }),
}))
