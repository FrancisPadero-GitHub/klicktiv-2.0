// SSR cookies behave differently than regular cookies,
// so we need to use the createBrowserClient function from @supabase/ssr to create a Supabase client that can handle SSR cookies properly.
// This allows us to maintain user sessions across server and client rendering in a Next.js application.
import { createBrowserClient } from "@supabase/ssr"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env
  .NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
