import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AUTH_QUERY_KEY } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw new Error(error.message)
  }
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY })
      queryClient.clear()
      toast.success("Logged out successfully")
    },
    onError: (error) => {
      console.error("Logout failed:", error)
      toast.error("Logout failed: something went wronge. Please try again.")
    },
  })
}
