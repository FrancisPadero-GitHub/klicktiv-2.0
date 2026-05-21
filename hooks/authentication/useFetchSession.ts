import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { Session } from "@supabase/supabase-js"

// used as a query key, this is useful as for dynamic query keys purposes.
export const auth_session_query_key = ["auth", "user"] as const

const fetchUserSession = async (): Promise<Session | null> => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

export function useFetchSession() {
  return useQuery({
    queryKey: auth_session_query_key,
    queryFn: fetchUserSession,
    staleTime: Infinity, // don't need to refetch since auth context handles the session subscription on auth
    retry: 2, // retry to login incase of internet failure or hiccups
  })
}
