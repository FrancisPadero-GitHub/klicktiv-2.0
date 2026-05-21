import { useMutation } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"

/**
 * Re-routing are handled by proxy.ts, which check the users' auth on the server side before hydrating the app.
 */

export type LoginFormValues = {
  email: string
  password: string
}

const login = async ({ email, password }: LoginFormValues) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export function useLogin() {
  return useMutation({
    mutationFn: (values: LoginFormValues) => login(values),
    // don't need to invalidate queries here cause auth context handles the session subscription
    // on auth state changes, but we can add side effects here if needed in the future.
  })
}
