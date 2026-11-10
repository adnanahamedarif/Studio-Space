
"use client"

import { useEffect, useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

import { authClient } from "@/lib/auth-client"

import {
  User,
  Mail,
  Link as LinkIcon,
  Eye,
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
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Name is required")
      return
    }

    setIsSaving(true)

    authClient.updateUser({
      name: name.trim(),
      image: image.trim() || undefined,
    })
      .then(({ error }) => {
        if (error) {
          toast.error(error.message || "Failed to update profile")
          return
        }

        toast.success("Profile updated successfully!")
        router.refresh()
      })
      .catch(() => {
        toast.error("Something went wrong")
      })
      .finally(() => {
        setIsSaving(false)
      })
  }

  // Cancel changes
  const handleCancel = () => {
    setName(user?.name || "")
    setImage(user?.image || "")
  }

  // Logout
  const handleLogout = () => {
    setIsLoggingOut(true)

    authClient.signOut()
      .then(() => {
        toast.success("Logged out successfully!")
        router.push("/login")
        router.refresh()
      })
      .catch(() => {
        toast.error("Logout failed")
      })
      .finally(() => {
        setIsLoggingOut(false)
      })
  }

  // Loading
  if (isPending) {
    return (
      <main className="grid min-h-[80vh] place-items-center bg-[#faf9ff]">
        <Loader2 className="size-8 animate-spin text-violet-700" />
      </main>
    )
  }

  // Login required
  if (!user) {
    return (
      <main className="grid min-h-[80vh] place-items-center bg-[#faf9ff] px-4">
        <div className="text-center">
          <User className="mx-auto size-12 text-slate-300" />

          <h2 className="mt-4 text-xl font-bold">
            Login Required
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Please login to view your profile.
          </p>

          <Button
            onClick={() => router.push("/login")}
            className="mt-5 bg-violet-700"
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
    <main className="min-h-screen bg-[#faf9ff] px-4 py-10">

      <div className="mx-auto max-w-[430px]">

        {/* Heading */}
        <div className="mb-7 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Account Profile
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Manage your personal details and account preferences.
          </p>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border border-violet-100 bg-white p-5 shadow-sm sm:p-7">

          {/* User Avatar */}
          <div className="mb-5 flex flex-col items-center border-b border-slate-100 pb-5">

            <div className="relative">
              {image ? (
                <img
                  src={image}
                  alt={name}
                  className="size-20 rounded-full border-2 border-slate-200 object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(name || "User")
                  }}
                />
              ) : (
                <div className="grid size-20 place-items-center rounded-full bg-violet-100 text-2xl font-bold text-violet-700">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}

              <span className="absolute right-1 bottom-1 size-3.5 rounded-full border-2 border-white bg-emerald-500" />
            </div>

            <h2 className="mt-2 text-sm font-bold text-slate-900">
              {name}
            </h2>

            <p className="mt-0.5 text-[10px] text-slate-500">
              {user.email}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-xs font-medium"
              >
                Full Name
              </Label>

              <div className="relative">
                <User className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400" />

                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="h-10 rounded-lg pl-9 text-xs"
                  required
                />
              </div>
            </div>

            {/* Profile Photo URL */}
            <div className="space-y-1.5">
              <Label
                htmlFor="image"
                className="text-xs font-medium"
              >
                Profile Photo URL
              </Label>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400" />

                  <Input
                    id="image"
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="h-10 rounded-lg pl-9 text-xs"
                  />
                </div>

                
              </div>

              <p className="text-[10px] text-slate-400">
                Enter a direct link to your profile photo.
              </p>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="email"
                  className="text-xs font-medium"
                >
                  Email Address
                </Label>

                <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[9px] text-violet-700">
                  Read-only
                </span>
              </div>

              <div className="relative">
                <Mail className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400" />

                <Input
                  id="email"
                  value={user.email}
                  readOnly
                  className="h-10 rounded-lg border-violet-100 bg-violet-50 pl-9 text-xs"
                />
              </div>
            </div>

            {/* Account Dates */}
            <div className="grid grid-cols-2 gap-3 pt-1">

              <div className="rounded-lg border border-violet-100 bg-violet-50/60 p-3">
                <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase text-violet-700">
                  <CalendarDays className="size-3" />
                  Member Since
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-900">
                  {formatDate(userDates.createdAt)}
                </p>
              </div>

              <div className="rounded-lg border border-violet-100 bg-violet-50/60 p-3">
                <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase text-violet-700">
                  <Clock className="size-3" />
                  Last Updated
                </p>

                <p className="mt-1 text-xs font-semibold text-slate-900">
                  {formatDate(userDates.updatedAt)}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">

              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
                className="h-9 rounded-lg px-4 text-xs"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSaving}
                className="h-9 rounded-lg bg-violet-700 px-5 text-xs hover:bg-violet-800"
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
          <div className="mt-5 border-t border-slate-100 pt-4 text-center">
            <Button
              type="button"
              variant="ghost"
              disabled={isLoggingOut}
              onClick={handleLogout}
              className="h-8 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
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
