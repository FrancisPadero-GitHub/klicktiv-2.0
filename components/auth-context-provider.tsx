"use client"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import {
  useContext,
  createContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react"

// lib
import { supabase } from "@/lib/supabase"

// hooks
import {
  useFetchSession,
  auth_session_query_key,
} from "@/hooks/authentication/useFetchSession"

// Types
import type { User, Session } from "@supabase/supabase-js"

/**
 * This is used to wrap the layout and provide auth state to all components in the tree.
 * uses cases for this is to hide a specific compenent if the role is not met.
 */

export type AuthContextValue = {
  user: User | null
  role: string | null
  session: Session | null
  isAuthenticated: boolean
  isFetching: boolean
  isError: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: session, isFetching, isError } = useFetchSession()

  // 2. Subscribe to auth events and sync Server/Client state
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Invalidate React Query cache to trigger a client-side refetch
      void queryClient.setQueryData(auth_session_query_key, session)

      // Commented to test if this is really needed.
      // void queryClient.invalidateQueries({
      //   queryKey: auth_session_query_key,
      //   exact: false,
      // })

      // If the user logs in or out, refresh the Next.js router.
      // This forces Server Components to re-evaluate with the new cookie state.
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        router.refresh()
        // proxy.ts will handle the redirecting based on the new authentication state
        // and the cookies that are now set or not set
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [queryClient, router])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session: session ?? null,
      isAuthenticated: !!session,
      role: session?.user.app_metadata.role ?? null,

      // rare use cases, but feel free to use it as you see fit
      isFetching: isFetching,
      isError: isError,
    }),
    [session, isFetching, isError]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Convenience hook – throws when used outside AuthProvider.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (ctx === undefined) {
    throw new Error("useAuth must be used within an <AuthProvider />")
  }
  return ctx
}
