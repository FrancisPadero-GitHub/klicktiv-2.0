import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AUTH_QUERY_KEY } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

/**
 * The actual Supabase sign-out call.
 * scope: "global" revokes the refresh token on the server side so the
 * session can't be silently restored on another tab or device.
 */
const signOut = async () => {
  const { error } = await supabase.auth.signOut({ scope: "global" })
  if (error) {
    throw new Error(error.message)
  }
}

/**
 * useLogout()
 *
 * Mutation hook for logging the user out. On success it:
 *  1. Writes null into the AUTH_QUERY_KEY cache slot immediately.
 *     (The onAuthStateChange listener in AuthProvider will also do this,
 *     but doing it here as well ensures the UI responds even before the
 *     Supabase listener fires.)
 *  2. Removes all other queries from the cache so no stale business data
 *     leaks between user sessions. We use removeQueries({ queryKey: [] })
 *     instead of queryClient.clear() to keep the removal scoped and avoid
 *     wiping queries that might be needed during the redirect animation.
 *
 * NOTE: We intentionally do NOT call invalidateQueries on AUTH_QUERY_KEY
 * here. invalidateQueries would trigger a background refetch of useFetchSession
 * → supabase.auth.getSession(), which can race against the token cleanup and
 * temporarily return a stale session. The setQueryData(null) call is enough
 * and is synchronous.
 */
export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      /**
       * Eagerly clear the session from the cache before the onAuthStateChange
       * listener fires. This guarantees the AuthContext is updated immediately
       * so UI guards (e.g. isAuthenticated) react without a browser refresh.
       */
      queryClient.setQueryData(AUTH_QUERY_KEY, null)

      /**
       * Remove all non-auth queries so that no business data from the previous
       * user's session lingers in the cache for the next user that might log in
       * on the same browser (e.g. shared/public computers).
       *
       * We intentionally keep the AUTH_QUERY_KEY slot in cache (already null)
       * so useFetchSession doesn't immediately fire a getSession() refetch on
       * the logout → login redirect.
       */
      queryClient.removeQueries({
        predicate: (query) =>
          JSON.stringify(query.queryKey) !== JSON.stringify(AUTH_QUERY_KEY),
      })

      toast.success("Logged out successfully")
    },
    onError: (error) => {
      console.error("Logout failed:", error)
      toast.error("Logout failed: something went wrong. Please try again.")
    },
  })
}
