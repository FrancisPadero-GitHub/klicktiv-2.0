import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

// Main proxy function to handle authentication and route protection from SSR
// This actually runs first before any hydration or client-side JavaScript, so it's perfect for auth checks and redirects
export async function proxy(request: NextRequest) {
  // Create an initial unmodified response object
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Create a Supabase server client for SSR, passing in environment variables and custom cookie handlers
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string,
    {
      cookies: {
        // Retrieve all cookies from the incoming request
        getAll() {
          return request.cookies.getAll()
        },
        // Set all cookies (e.g., after a session refresh)
        setAll(cookiesToSet) {
          // Update cookies in the request object
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )

          // Recreate the response to ensure new headers are included
          supabaseResponse = NextResponse.next({
            request,
          })

          // Set the new/updated cookies on the response
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Extract the role from raw_app_meta_data on auth.users
  // Either super_admin, company or va/user
  const userRole = user?.app_metadata.role as string | undefined

  // 2. Define route logic for protected and public pages
  const currentPath = request.nextUrl.pathname
  const isSuperAdmin = request.nextUrl.pathname.startsWith(
    "/super-admin"
  )
  const isNormalUser = request.nextUrl.pathname.startsWith(
    "/dashboard"
  )
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/forgot-password")

  // 3. Handle redirects based on authentication state
  if ((isSuperAdmin || isNormalUser) && !user) {
    const loginUrl = new URL("/login", request.url)

    // Attaches their intended destination as the 'next' parameter
    // Example: /authentication/login?next=/dashboard/settings/profile
    loginUrl.searchParams.set("next", currentPath)

    //Redirects them
    return NextResponse.redirect(loginUrl)
  }

  /** NOTE:
   * The above logic ensures that:
   */

  // Authenticated user routing logic
  if (user) {
    // A. Route away from Auth pages based on role
    if (isAuthPage) {
      if (userRole === "super_admin") {
        return NextResponse.redirect(
          new URL("/super-admin", request.url)
        )
      // other roles (company, va/user) should be sent to the normal dashboard
      } else {
        return NextResponse.redirect(
          new URL("/dashboard", request.url)
        )
      }
    }

    // B. Protect role-specific routes (Prevent 'user' from accessing '/super-admin')
    if (
      currentPath.startsWith("/super-admin") &&
      userRole !== "super_admin"
    ) {
      // Kick them back to their appropriate dashboard
      return NextResponse.redirect(
        new URL("/dashboard", request.url)
      )
    }
  }

  // Return the (possibly updated) response
  return supabaseResponse
}
/**
 * Run the Supabase auth check on absolutely every single page of my website... EXCEPT for these specific files.
 * Imagine a user goes to your /dashboard. To load that one page, the browser actually makes dozens of background requests:
 * 1 request for the HTML page.
 * 5 requests for different JavaScript chunks (_next/static/…).
 * 1 request for your logo (logo.png).
 * 1 request for the tab icon (favicon.ico).
 * Without the matcher, your middleware would ping Supabase to check the user's session 8 separate times
 * just to load one page. That will drastically slow down your website and burn through
 * your Supabase database quota for absolutely no reason.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
