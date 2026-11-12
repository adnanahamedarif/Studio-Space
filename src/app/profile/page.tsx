
"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

import { authClient } from "@/lib/auth-client"

import {
  User,
  Mail,
  Link as LinkIcon,
  CalendarDays,
  Clock,
  LogOut,
  Check,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProfilePage() {
  const router = useRouter()

  const { data: session, isPending } = authClient.useSession()

  const user = session?.user

  const [name, setName] = useState("")
  const [image, setImage] = useState("")

  const [isSaving, setIsSaving] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Set user information
  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setImage(user.image || "")
    }
  }, [user])

  // Format date
  const formatDate = (date?: Date | string) => {
    if (!date) return "Not available"

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Save profile
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Name is required")
      return
    }

    try {
      setIsSaving(true)

      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || undefined,
      })

      if (error) {
        toast.error(error.message || "Failed to update profile")
        return
      }

      toast.success("Profile updated successfully!")
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsSaving(false)
    }
  }

  // Cancel changes
  const handleCancel = () => {
    setName(user?.name || "")
    setImage(user?.image || "")
  }

  // Logout
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)

      const { error } = await authClient.signOut()

      if (error) {
        toast.error(error.message || "Logout failed")
        return
      }

      toast.success("Logged out successfully!")
      router.push("/login")
      router.refresh()
    } catch {
      toast.error("Logout failed")
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Loading
  if (isPending) {
    return (
      <main className="grid min-h-[80vh] place-items-center bg-background transition-colors duration-300">
        <Loader2 className="size-8 animate-spin text-brand" />
      </main>
    )
  }

  // Login required
  if (!user) {
    return (
      <main className="grid min-h-[80vh] place-items-center bg-background px-4">
        <div className="text-center">
          <User className="mx-auto size-12 text-muted-foreground" />

          <h2 className="mt-4 text-xl font-bold text-foreground">
            Login Required
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Please login to view your profile.
          </p>

          <Button
            onClick={() => router.push("/login")}
            className="mt-5 bg-brand text-white hover:bg-brand-strong"
          >
            Login
          </Button>
        </div>
      </main>
    )
  }

  const userDates = user as typeof user & {
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 transition-colors duration-300">
      <div className="mx-auto max-w-[430px]">

        {/* Heading */}
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Account Profile
          </h1>

          <p className="mt-1 text-xs text-muted-foreground">
            Manage your personal details and account preferences.
          </p>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm transition-colors duration-300 sm:p-7">

          {/* User Avatar */}
          <div className="mb-5 flex flex-col items-center border-b border-border pb-5">
            <div className="relative">
              {image ? (
                <img
                  src={image}
                  alt={name}
                  className="size-20 rounded-full border-2 border-border object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(name || "User")
                  }}
                />
              ) : (
                <div className="grid size-20 place-items-center rounded-full bg-brand-soft text-2xl font-bold text-brand">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}

              <span className="absolute right-1 bottom-1 size-3.5 rounded-full border-2 border-card bg-emerald-500" />
            </div>

            <h2 className="mt-2 text-sm font-bold text-foreground">
              {name}
            </h2>

            <p className="mt-0.5 text-[10px] text-muted-foreground">
              {user.email}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-xs font-medium text-foreground"
              >
                Full Name
              </Label>

              <div className="relative">
                <User className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="h-10 rounded-lg border-border bg-background pl-9 text-xs text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
            </div>

            {/* Profile Photo URL */}
            <div className="space-y-1.5">
              <Label
                htmlFor="image"
                className="text-xs font-medium text-foreground"
              >
                Profile Photo URL
              </Label>

              <div className="relative">
                <LinkIcon className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="image"
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="h-10 rounded-lg border-border bg-background pl-9 text-xs text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <p className="text-[10px] text-muted-foreground">
                Enter a direct link to your profile photo.
              </p>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="email"
                  className="text-xs font-medium text-foreground"
                >
                  Email Address
                </Label>

                <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[9px] text-brand">
                  Read-only
                </span>
              </div>

              <div className="relative">
                <Mail className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="email"
                  value={user.email}
                  readOnly
                  className="h-10 rounded-lg border-border bg-muted pl-9 text-xs text-muted-foreground"
                />
              </div>
            </div>

            {/* Account Dates */}
            <div className="grid grid-cols-2 gap-3 pt-1">

              <div className="rounded-lg border border-border bg-brand-soft/50 p-3">
                <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase text-brand">
                  <CalendarDays className="size-3" />
                  Member Since
                </p>

                <p className="mt-1 text-xs font-semibold text-foreground">
                  {formatDate(userDates.createdAt)}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-brand-soft/50 p-3">
                <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase text-brand">
                  <Clock className="size-3" />
                  Last Updated
                </p>

                <p className="mt-1 text-xs font-semibold text-foreground">
                  {formatDate(userDates.updatedAt)}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
                className="h-9 rounded-lg border-border px-4 text-xs"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSaving}
                className="h-9 rounded-lg bg-brand px-5 text-xs text-white hover:bg-brand-strong"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="mr-1.5 size-3.5" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Logout */}
          <div className="mt-5 border-t border-border pt-4 text-center">
            <Button
              type="button"
              variant="ghost"
              disabled={isLoggingOut}
              onClick={handleLogout}
              className="h-8 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-500/10 dark:hover:text-red-300"
            >
              {isLoggingOut ? (
                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
              ) : (
                <LogOut className="mr-1.5 size-3.5" />
              )}
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
