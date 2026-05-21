"use client"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Eye, EyeOff, Loader2, ArrowRight, LayoutDashboard } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

// components
import LoginBanner from "./login-banner"

// hooks
import { useLogin, type LoginFormValues } from "@/hooks/authentication/useLogin"

// public
import KlicktivLogoLightMode from "@/public/kt_logo_name.png"
import KlicktivLogoDarkMode from "@/public/kt_logo_name_dark.png"

export default function LoginPage() {
  const router = useRouter()
  // used to disable the submit button and show "Dashboard" if the user is already authenticated (e.g. from a previous session)

  const { mutate: loginMutation, error: loginError, isPending } = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
  })
  const [showPassword, setShowPassword] = useState(false)
  function onSubmit(values: LoginFormValues) {
    loginMutation(values)
  }

  const serverError = loginError
    ? loginError instanceof Error
      ? loginError.message
      : "Something went wrong."
    : null

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Banner Section */}
      <LoginBanner />

      {/* Right Form Section */}
      <div className="animate-fade-in flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8 lg:py-24">
        <div className="animate-fade-up-delay-1 mx-auto w-full max-w-sm">
          {/* Logo */}
          <div className="mb-5 flex flex-col items-center text-center">
            <Link
              href="/"
              className="inline-flex h-auto w-25 items-center gap-2 transition-transform hover:scale-[1.02]"
            >
              <Image
                src={KlicktivLogoLightMode}
                title="Go to landing page"
                alt="Klicktiv"
                // these values here are based on the original dimensions of the image, as per requirement from the nextjs/image documentation.
                // the control the actual image itself you must wrap this on a parent and there you set the h and w you want.
                width={1672}
                height={941}
                priority
                quality={100}
                className="block dark:hidden"
              />
              <Image
                src={KlicktivLogoDarkMode}
                title="Go to landing page"
                alt="Klicktiv"
                width={1672}
                height={941}
                priority
                quality={100}
                className="hidden dark:block"
              />
            </Link>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Log in to your account to continue
            </p>
          </div>

          {/* Form Card */}
          <div className="animate-scale-in rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md">
            {serverError && (
              <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {serverError}
              </div>
            )}

            <form
              onSubmit={(e) => void handleSubmit(onSubmit)(e)}
              noValidate
              className="space-y-5"
            >
              {/* Email */}
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">Email address</FieldLabel>
                <FieldContent>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={!!errors.email}
                    aria-describedby="email-error"
                    className={cn(
                      "w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground placeholder-muted-foreground transition-all outline-none",
                      "focus:border-primary focus:ring-2 focus:ring-primary/20",
                      errors.email
                        ? "border-destructive/50 focus:border-destructive focus:ring-destructive/20"
                        : "border-input"
                    )}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                      },
                    })}
                  />
                </FieldContent>
                <FieldError errors={[errors.email]} />
              </Field>

              {/* Password */}
              <Field data-invalid={!!errors.password}>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="#"
                    className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FieldContent>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      aria-invalid={!!errors.password}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className={cn(
                        "w-full rounded-xl border bg-background px-4 py-3 pr-10 text-sm text-foreground placeholder-muted-foreground transition-all outline-none",
                        "focus:border-primary focus:ring-2 focus:ring-primary/20",
                        errors.password
                          ? "border-destructive/50 focus:border-destructive focus:ring-destructive/20"
                          : "border-input"
                      )}
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FieldContent>
                <FieldError errors={[errors.password]} />
              </Field>

              {/* Submit / Dashboard Button */}
              <button
                type="submit"
                disabled={isPending}
                className={cn(
                  "mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold shadow-sm transition-all",
                  // Standard Login Style
                  "bg-primary text-primary-foreground hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50"
                  // Obvious Authenticated Style (Success state)
                )}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  "Log in"
                )}
              </button>
            </form>
          </div>

          {/* Footer link */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="https://advancedvirtualstaff.com/booking"
              className="font-semibold text-foreground underline-offset-4 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
