"use client"
import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  MessageSquarePlus,
  Loader2,
  ImagePlus,
  X,
  AlertCircle,
} from "lucide-react"
import { toast } from "sonner"

// hooks
import { useSubmitFeedback } from "@/hooks/feedbacks/use-submit-feedback"
import type { FeedbackPayload } from "@/hooks/feedbacks/use-submit-feedback"

// utils
import { cn } from "@/lib/utils"

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]
const ALLOWED_EXT_LABEL = "JPG, PNG, WEBP, GIF"
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024 // 50 MB

interface FeedbackPageProps {
  children?: React.ReactNode
}

type FeedbackFormValues = {
  title: string
  type: "bug" | "feature_request" | "feedback"
  description: string
}

function FeedbackPage({ children }: FeedbackPageProps) {
  const [open, setOpen] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const previewUrlRef = useRef<string | null>(null)

  const form = useForm<FeedbackFormValues>({
    defaultValues: {
      title: "",
      type: "feedback",
      description: "",
    },
  })

  const { mutate: submitFeedback, isPending: loading } = useSubmitFeedback()

  // Keep file state and browser object URLs in sync when the user changes or clears the attachment.
  const clearFilePreview = (options?: { resetInput?: boolean }) => {
    const shouldResetInput = options?.resetInput ?? true

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = null
    }

    setPreview(null)
    setFileError(null)

    if (shouldResetInput && fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Revoke any generated preview URL when the component unmounts.
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current)
        previewUrlRef.current = null
      }
    }
  }, [])

  const validateSelectedFile = (file: File) => {
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return `Unsupported file type. Please upload: ${ALLOWED_EXT_LABEL}.`
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return "File exceeds the 50 MB limit. Please choose a smaller image."
    }

    return null
  }

  const resetFeedbackForm = () => {
    form.reset()
    clearFilePreview()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    clearFilePreview({ resetInput: false })

    if (!file) return

    const validationError = validateSelectedFile(file)
    if (validationError) {
      setFileError(validationError)
      e.target.value = ""
      return
    }

    const objectUrl = URL.createObjectURL(file)
    previewUrlRef.current = objectUrl
    setPreview(objectUrl)
  }

  const handleFormSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const isValid = await form.trigger()

    if (!isValid || fileError) return

    // Read all values directly from React Hook Form — Radix UI components
    // (Select, etc.) are controlled and do NOT write into native FormData,
    // so we must collect them from RHF rather than from the DOM.
    const { title, description, type } = form.getValues()

    // Pick up the file directly from the input ref.
    const fileEl = fileInputRef.current
    const screenshot =
      fileEl?.files && fileEl.files.length > 0 ? fileEl.files[0] : null

    const payload: FeedbackPayload = { title, description, type, screenshot }

    // The mutation handles the backend work: screenshot upload first, then feedback insert.
    submitFeedback(payload, {
      onSuccess: () => {
        setOpen(false)
        resetFeedbackForm()
        toast.success("Feedback submitted", {
          description: "Thank you! We've received your feedback.",
          position: "top-right",
        })
      },
      onError: () => {
        console.error(
          "Feedback error: Something went wrong, please try again later."
        )
        toast.error("Error submitting feedback", {
          description: "Something went wrong, please try again later.",
          position: "top-right",
        })
      },
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          resetFeedbackForm()
        }

        setOpen(nextOpen)
      }}
    >
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant="outline" className="gap-2">
            <MessageSquarePlus className="h-4 w-4" />
            Submit Feedback
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="overflow-hidden p-0 sm:max-w-140">
        <div className="flex max-h-[85vh] flex-col">
          <DialogHeader className="border-b px-6 py-6 pb-4">
            <DialogTitle>Submit Feedback</DialogTitle>
            <DialogDescription>
              Help us improve by providing your feedback, feature requests, or
              reporting bugs.
            </DialogDescription>
          </DialogHeader>

          <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-6 py-5">
            <Form {...form}>
              <form
                onSubmit={(e) => {
                  void handleFormSubmit(e)
                }}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="title"
                  rules={{ required: "Title is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Brief summary"
                          className="break-all"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  rules={{ required: "Please select a feedback type" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={loading}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bug">Bug Report</SelectItem>
                          <SelectItem value="feature_request">
                            Feature Request
                          </SelectItem>
                          <SelectItem value="feedback">
                            General Feedback
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  rules={{ required: "Description is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please provide details..."
                          className="min-h-25 break-all"
                          disabled={loading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel htmlFor="screenshot">
                    Attach Screenshot (Optional)
                  </FormLabel>
                  <FormControl>
                    {/* The visible drop zone is the form control; the actual input is stretched over it. */}
                    <div
                      className={cn(
                        "relative rounded-md border border-dashed transition-colors",
                        fileError
                          ? "border-destructive bg-destructive/5"
                          : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 dark:hover:border-zinc-500"
                      )}
                    >
                      <input
                        ref={fileInputRef}
                        id="screenshot"
                        name="screenshot"
                        type="file"
                        accept={ALLOWED_MIME_TYPES.join(",")}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        disabled={loading}
                        onChange={handleFileChange}
                      />

                      {preview ? (
                        <div className="flex items-center gap-3 p-3">
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border border-zinc-200 dark:border-zinc-700">
                            <Image
                              src={preview}
                              alt="Screenshot preview"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-zinc-500">
                              Click to replace
                            </p>
                          </div>
                          <button
                            type="button"
                            aria-label="Remove screenshot"
                            onClick={(e) => {
                              e.stopPropagation()
                              clearFilePreview()
                            }}
                            disabled={loading}
                            className="shrink-0 rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-1 py-5 text-center">
                          <ImagePlus className="h-6 w-6 text-zinc-400" />
                          <p className="text-sm text-zinc-500">
                            Click to upload a screenshot
                          </p>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  {fileError && (
                    <p className="flex items-center gap-1.5 text-xs break-all text-destructive">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {fileError}
                    </p>
                  )}
                  <FormDescription>
                    Accepted: {ALLOWED_EXT_LABEL} &mdash; Max size: 50 MB
                  </FormDescription>
                </FormItem>

                <DialogFooter className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Submit
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FeedbackPage
