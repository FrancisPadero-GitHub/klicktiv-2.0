import { useMutation } from "@tanstack/react-query"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/providers/auth-context-provider"
import { supabase } from "@/lib/supabase"

export interface FeedbackPayload {
  title: string
  description: string
  type: string
  /** The screenshot file selected by the user, or null if none was chosen. */
  screenshot: File | null
}

export function useSubmitFeedback() {
  const pathname = usePathname()

  const { user, company_id } = useAuth()

  const companyId = typeof company_id === "string" ? company_id : null

  const uploadScreenshot = async (file: File) => {
    // Store the screenshot under a company-scoped folder so the bucket stays organized.
    const fileExt = file.name.split(".").pop() || "png"
    const fileName = `${crypto.randomUUID()}.${fileExt}`
    const filePath = `${companyId}/feedback/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("feedback-screenshots")
      .upload(filePath, file)

    if (uploadError) {
      throw new Error("Failed to upload screenshot. Please try again.")
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("feedback-screenshots").getPublicUrl(filePath)

    return publicUrl
  }

  const submitFeedbackMutationFn = async (payload: FeedbackPayload) => {
    const { title, description, type, screenshot } = payload

    let screenshot_url = null

    // Upload only real files. Empty input fields arrive as a File with size 0.
    if (screenshot instanceof File && screenshot.size > 0) {
      screenshot_url = await uploadScreenshot(screenshot)
    }

    const { error: insertError } = await supabase
      .from("feedback_reports")
      .insert([
        {
          company_id: companyId,
          user_id: user?.id || null,
          type,
          title,
          description,
          page_url: pathname,
          screenshot_url,
        },
      ])

    if (insertError) {
      throw insertError
    }
  }

  return useMutation({
    mutationFn: submitFeedbackMutationFn,
  })
}
