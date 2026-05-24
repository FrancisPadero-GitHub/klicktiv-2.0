import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { Session } from "@supabase/supabase-js"
import { AUTH_QUERY_KEY } from "@/lib/auth"

/**
 * Fetches the current Supabase session from the local token store.
 * Returns null (not an error) when the user is not authenticated.
 *
 * This function is only called on initial mount. All subsequent session
 * updates are pushed into the cache by the onAuthStateChange listener in
 * AuthProvider via queryClient.setQueryData — so this fetch is effectively
 * a "bootstrap" call and should not be re-triggered during the session lifetime.
 */
const fetchUserSession = async (): Promise<Session | null> => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

/**
 * useFetchSession()
 *
 * Loads the initial session on app boot and seeds the React Query cache.
 *
 * Key decisions:
 *  - staleTime: Infinity — prevents React Query from ever marking this as
 *    stale and auto-refetching it. The onAuthStateChange listener in
 *    AuthProvider is the only thing that should update this cache entry.
 *    Auto-refetches would race against Supabase's async token cleanup and
 *    can cause the stale-session-after-logout bug.
 *
 *  - retry: false — a missing/expired session returns null, not an error.
 *    Retrying adds unnecessary delay on the login page with no benefit.
 *    Network errors from Supabase are uncommon and better surfaced
 *    immediately via isError so the UI can show a helpful message.
 *
 *  - gcTime (formerly cacheTime) is left at the default (5 min) so the
 *    cache slot is preserved during route transitions.
 */
export function useFetchSession() {
  return useQuery<Session | null>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: fetchUserSession,
    staleTime: Infinity,
    retry: false,
  })
}
