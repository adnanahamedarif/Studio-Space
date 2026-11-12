
"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Image as ImageIcon,
  ArrowRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"

export default function RegisterPage() {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [form, setForm] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
  })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }

    if (
      !/[A-Z]/.test(form.password) ||
      !/[a-z]/.test(form.password)
    ) {
      toast.error(
        "Password must contain uppercase and lowercase letters"
      )
      return
    }

    try {
      setIsLoading(true)

      const { data, error } = await authClient.signUp.email({
        name: form.name,
        email: form.email,
        password: form.password,
        image: form.image.trim() || undefined,
        callbackURL: "/",
      })

      if (error) {
        toast.error(error.message || "Registration failed")
        return
      }

      if (data) {
        toast.success("Account created successfully!")
        router.push("/")
        router.refresh()
      }
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      })

      if (error) {
        toast.error(error.message || "Google sign up failed")
      }
    } catch {
      toast.error("Google sign up failed")
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8f6ff] px-4 py-10 transition-colors duration-300 dark:bg-background">

      {/* Background Decoration */}
      <div className="pointer-events-none absolute -top-32 left-1/2 size-96 -translate-x-1/2 rounded-full bg-violet-200/40 blur-3xl dark:bg-violet-600/10" />

      <div className="relative z-10 w-full max-w-[430px]">

        {/* Heading */}
        <div className="mb-6 text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-[10px] font-bold tracking-wide text-violet-700 dark:bg-brand-soft dark:text-brand">
            <span className="size-1.5 rounded-full bg-violet-600 dark:bg-brand" />
            CREATOR SANCTUARY PASS
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-foreground sm:text-[28px]">
            Create your creator account
          </h1>

          <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-slate-500 dark:text-muted-foreground">
            Book hourly daylight studios, sound stages, and podcast
            rooms with ease.
          </p>
        </div>

        {/* Register Form */}
        <div className="rounded-2xl border border-white bg-white p-5 shadow-[0_8px_35px_rgba(70,50,130,0.08)] transition-colors duration-300 dark:border-border dark:bg-card sm:p-7">

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Profile Photo Preview */}
            {form.image && (
              <div className="flex items-center gap-3 pt-1">
                <img
                  src={form.image}
                  alt="Profile preview"
                  className="size-20 rounded-full border border-border bg-muted object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                  }}
                />

                <span className="text-[10px] text-muted-foreground">
                  Profile photo preview
                </span>
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-xs font-semibold text-foreground"
              >
                Full Name
              </Label>

              <div className="relative">
                <User className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="e.g. Alex Rivers"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="h-10 rounded-lg border-border bg-background pl-10 text-xs text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-semibold text-foreground"
              >
                Email Address
              </Label>

              <div className="relative">
                <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@creative.studio.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="h-10 rounded-lg border-border bg-background pl-10 text-xs text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>

            {/* Profile Image */}
            <div className="space-y-1.5">
              <Label
                htmlFor="image"
                className="text-xs font-semibold text-foreground"
              >
                Profile Photo URL{" "}
                <span className="font-normal text-muted-foreground">
                  (Optional)
                </span>
              </Label>

              <div className="relative">
                <ImageIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="image"
                  type="url"
                  name="image"
                  placeholder="https://example.com/avatar.jpg"
                  value={form.image}
                  onChange={(e) =>
                    setForm({ ...form, image: e.target.value })
                  }
                  className="h-10 rounded-lg border-border bg-background pl-10 text-xs text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-xs font-semibold text-foreground"
              >
                Password
              </Label>

              <div className="relative">
                <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a secure password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="h-10 rounded-lg border-border bg-background px-10 text-xs text-foreground placeholder:text-muted-foreground"
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-brand"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>

              <p className="text-[10px] text-muted-foreground">
                Include at least 8 characters with uppercase and lowercase letters.
              </p>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="h-10 w-full rounded-lg bg-brand text-xs font-semibold text-white shadow-sm hover:bg-brand-strong"
            >
              {isLoading ? (
                "Creating Account..."
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 size-3.5" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />

            <span className="text-[9px] font-semibold text-muted-foreground">
              OR SIGN UP WITH
            </span>

            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Google Signup */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignup}
            className="h-10 w-full rounded-lg border-border bg-background text-xs font-medium text-foreground hover:bg-accent"
          >
            <svg viewBox="0 0 48 48" className="mr-2 size-4">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.75 7.18l7.73 6C44.42 37.93 46.98 31.8 46.98 24.55z"/>
              <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 43.62 14.62 48 24 48z"/>
            </svg>

            Continue with Google
          </Button>

          {/* Login */}
          <div className="mt-5 border-t border-border pt-4 text-center">
            <p className="text-[11px] text-muted-foreground">
              Already have an account?{" "}

              <Link
                href="/login"
                className="font-semibold text-brand hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
