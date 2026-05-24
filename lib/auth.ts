/**
 * AUTH_QUERY_KEY
 *
 * The canonical React Query key for the user's session cache entry.
 * Used by:
 *   - useFetchSession  → seeds the cache on mount
 *   - AuthProvider     → writes new values via setQueryData on auth events
 *   - useLogout        → writes null via setQueryData on sign-out
 *
 * Keeping this in one place prevents typos and makes it easy to search
 * for all callsites with a single grep. The `as const` assertion ensures
 * TypeScript treats this as a readonly tuple so it cannot be mutated.
 *
 * Structure: ["auth", "user"]
 *   - "auth"  → top-level namespace for all auth-related queries
 *   - "user"  → the specific resource being cached (the session/user)
 *
 * If you need to invalidate all auth-related queries in bulk (e.g. in tests),
 * you can use { queryKey: ["auth"], exact: false }.
 */
export const AUTH_QUERY_KEY = ["auth", "user"] as const