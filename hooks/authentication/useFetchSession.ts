import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import type { Session } from "@supabase/supabase-js"
import { AUTH_QUERY_KEY } from "@/lib/auth"

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
    queryKey: AUTH_QUERY_KEY,
    queryFn: fetchUserSession,
    staleTime: Infinity, // don't need to refetch since auth context handles the session subscription on auth
    retry: 2, // retry to login incase of internet failure or hiccups
  })
}
