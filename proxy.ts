import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

/**
 * Main proxy function to handle authentication and route protection via SSR.
 * Runs before any hydration or client-side JavaScript — perfect for auth
 * checks and redirects.
 */
export async function proxy(request: NextRequest) {
  // Create an initial unmodified response object.
  let supabaseResponse = NextResponse.next({ request })

  // Create a Supabase server client for SSR with custom cookie handlers.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string,
    {
      cookies: {
        // Retrieve all cookies from the incoming request.
        getAll() {
          return request.cookies.getAll()
        },
        // Set all cookies (e.g. after a session refresh).
        setAll(cookiesToSet) {
          // Update cookies in the request object.
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))

          // Recreate the response to ensure new headers are included.
          supabaseResponse = NextResponse.next({ request })

          // Set the new/updated cookies on the response.
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Extract the role from raw_app_meta_data on auth.users.
  // Possible values: super_admin | company | va/user
  const userRole = user?.app_metadata.role as string | undefined

  // ─── Route Definitions ──────────────────────────────────────────────────────

  const currentPath = request.nextUrl.pathname
  const isSuperAdmin = request.nextUrl.pathname.startsWith("/super-admin")
  const isNormalUser = request.nextUrl.pathname.startsWith("/dashboard")
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/forgot-password")

  // ─── Unauthenticated Guard ───────────────────────────────────────────────────

  if ((isSuperAdmin || isNormalUser) && !user) {
    const loginUrl = new URL("/login", request.url)

    // Attach the intended destination as the 'next' param so we can redirect
    // after login. e.g. /login?next=/dashboard/settings/profile
    loginUrl.searchParams.set("next", currentPath)

    return NextResponse.redirect(loginUrl)
  }

  // ─── Authenticated Routing ───────────────────────────────────────────────────

  if (user) {
    // A. Redirect away from auth pages based on role or intended destination.
    if (isAuthPage) {
      const nextParam = request.nextUrl.searchParams.get("next")

      if (nextParam) {
        try {
          const redirectUrl = new URL(nextParam, request.url)

          // Security check: only redirect within the same host origin.
          if (redirectUrl.origin === request.nextUrl.origin) {
            return NextResponse.redirect(redirectUrl)
          }
        } catch {
          // Fallback to standard role routing if URL parsing fails.
        }
      }

      if (userRole === "super_admin") {
        return NextResponse.redirect(new URL("/super-admin", request.url))
      } else {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }

    /**
     * TODO:
     * - Implement a granular access control system here.
     * - Add a fallback 404 page for unauthorized access instead of redirecting
     *   to the dashboard (prevents route enumeration).
     */

    // B. Prevent non-super-admins from accessing /super-admin routes.
    if (currentPath.startsWith("/super-admin") && userRole !== "super_admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // C. Prevent non-company users from accessing /dashboard/technicians.
    //    Redirect to /dashboard (not a 404) so the route isn't exposed.
    if (currentPath.startsWith("/dashboard/technicians") && userRole !== "company") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
