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
import { useFetchSession } from "@/hooks/authentication/useFetchSession"
import { AUTH_QUERY_KEY } from "@/lib/auth"

// Types
import type { User, Session } from "@supabase/supabase-js"

/**
 * AuthContextValue
 *
 * Exposes the current auth state to any component in the tree via useAuth().
 * Useful for role-based UI gating, showing/hiding elements, or reading the
 * current user's metadata without hitting Supabase on every render.
 */
export type AuthContextValue = {
  user: User | null
  role: string | null
  session: Session | null
  isAuthenticated: boolean
  company_id: string | null
  /** True while the initial session fetch is in-flight */
  isFetching: boolean
  /** True if the initial session fetch errored out */
  isError: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const router = useRouter()

  /**
   * useFetchSession() is the *initial* session loader.
   * It runs once on mount with staleTime: Infinity, meaning React Query
   * will never automatically refetch it in the background — the
   * onAuthStateChange listener below is the single source of truth
   * for all subsequent session updates.
   */
  const { data: session, isFetching, isError } = useFetchSession()

  /**
   * Subscribe to Supabase auth events and keep the React Query cache in sync.
   *
   * Why we use setQueryData instead of invalidateQueries on SIGNED_OUT:
   *
   *   invalidateQueries marks the query as stale and triggers a background
   *   refetch via useFetchSession → supabase.auth.getSession().
   *   The problem is that getSession() reads from the local token store, which
   *   may not be cleared *immediately* after signOut() completes. This race
   *   condition causes the old session to briefly linger in the cache and the
   *   AuthContext still reports the user as authenticated until the next render
   *   cycle — hence the "needs a browser refresh" symptom.
   *
   *   Instead, we write null directly into the cache with setQueryData.
   *   This is synchronous, immediate, and doesn't involve a re-fetch that
   *   could race against the Supabase token cleanup.
   */
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      /**
       * Directly write the authoritative session value into the cache.
       * On SIGNED_OUT, newSession is null — this guarantees the AuthContext
       * reacts instantly without waiting for a refetch.
       */
      queryClient.setQueryData<Session | null>(AUTH_QUERY_KEY, newSession)

      if (event === "SIGNED_IN") {
        /**
         * After login, refresh server components so Next.js middleware (proxy.ts)
         * can re-evaluate the new auth cookies and redirect appropriately.
         */
        router.refresh()
      }

      if (event === "SIGNED_OUT") {
        /**
         * On logout:
         * 1. The setQueryData above already wrote null — context updates immediately.
         * 2. router.refresh() re-runs the middleware which will redirect to /login.
         * 3. We do NOT call invalidateQueries here because that would trigger a
         *    re-fetch that might temporarily return a stale session, which is the
         *    exact bug we are fixing.
         * 4. We also do NOT call queryClient.clear() here — that's handled
         *    in useLogout's onSuccess so the cache is wiped from the mutation side.
         *    Clearing here too would cause a double-clear and potential race.
         */
        router.refresh()
      }

      if (event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
        /**
         * Token refresh / user profile update: the new session is already written
         * above via setQueryData. No router.refresh() needed since the server-side
         * cookie is updated automatically by @supabase/ssr.
         */
      }
    })

    return () => {
      // Unsubscribe when the provider unmounts to avoid memory leaks.
      subscription.unsubscribe()
    }
  }, [queryClient, router])

  /**
   * Derive the context value from the cached session.
   * useMemo ensures downstream consumers only re-render when session,
   * isFetching, or isError actually change — not on every AuthProvider render.
   */
  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session: session ?? null,
      isAuthenticated: !!session,
      role: session?.user.app_metadata.role ?? null,
      company_id: session?.user.app_metadata.company_id ?? null,
      // Rare use-cases — prefer isAuthenticated/user for most guards.
      isFetching,
      isError,
    }),
    [session, isFetching, isError]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * useAuth()
 *
 * Convenience hook — throws when used outside <AuthProvider />.
 * Use this anywhere you need the current user, role, or session.
 *
 * @example
 * const { user, role, isAuthenticated } = useAuth()
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (ctx === undefined) {
    throw new Error("useAuth must be used within an <AuthProvider />")
  }
  return ctx
}
