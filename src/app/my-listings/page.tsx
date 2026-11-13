
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import toast from "react-hot-toast"

import {
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Users,
  Image as ImageIcon,
  Loader2,
  Building2,
  CalendarDays,
  Clock,
  ChevronDown,
  CheckCircle2,
  XCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { authClient } from "@/lib/auth-client"
import { getTokenFromClient } from "@/lib/getTokenFromClient"

type Booking = {
  _id: string
  studioId: string
  studioTitle: string
  customerEmail: string
  bookingDate: string
  startTime: string
  endTime: string
  totalHours: number
  totalPrice: number
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled"
}

type Studio = {
  _id: string
  title: string
  category: string
  location: string
  hourlyRate: number
  securityDeposit: number
  capacity: number
  images: string[]
  amenities: string[]
  description: string
  ownerEmail: string
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const bookingStatusStyle = {
  Pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  Confirmed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  Completed:
    "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
  Cancelled:
    "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
}

export default function MyListingsPage() {
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession()

  const userEmail = session?.user?.email

  const [studios, setStudios] = useState<Studio[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // View bookings for a selected studio
  const [openStudioId, setOpenStudioId] = useState<string | null>(null)
  const [studioBookings, setStudioBookings] = useState<Booking[]>([])
  const [isBookingsLoading, setIsBookingsLoading] = useState(false)
  const [bookingActionId, setBookingActionId] = useState<string | null>(null)

  // Fetch user's studio listings
  useEffect(() => {
    if (isSessionLoading) return

    if (!userEmail) {
      setIsLoading(false)
      return
    }

    let isActive = true

    const loadListings = async () => {
      setError("")
      setIsLoading(true)

      try {
        const token = await getTokenFromClient()

        if (!token) {
          throw new Error("Please login again.")
        }

        const response = await fetch(`${API_URL}/my-listings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || "Failed to load listings")
        }

        if (!isActive) return

        setStudios(result.studios || [])
      } catch (error) {
        if (!isActive) return

        console.log(error)

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load listings"
        )
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadListings()

    return () => {
      isActive = false
    }
  }, [userEmail, isSessionLoading])

  // Delete studio
const handleDelete = async () => {
  if (!deleteId || !userEmail) return

  setIsDeleting(true)

  const token = await getTokenFromClient()

  if (!token) {
    setIsDeleting(false)
    return
  }

  const response = await fetch( `${API_URL}/my-listings/${deleteId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const result = await response.json()

  if (!response.ok) {
    setIsDeleting(false)
    return
  }

  setStudios((previous) =>
    previous.filter((studio) => studio._id !== deleteId)
  )

  toast.success(result.message || "Studio deleted successfully!")

  setDeleteId(null)
  setIsDeleting(false)
}

  // View bookings
  const handleViewBookings = async (studio: Studio) => {
    if (openStudioId === studio._id) {
      setOpenStudioId(null)
      setStudioBookings([])
      return
    }

    setOpenStudioId(studio._id)
    setStudioBookings([])
    setIsBookingsLoading(true)

    try {
      const token = await getTokenFromClient()

      if (!token) {
        throw new Error("Please login again.")
      }

      const response = await fetch(
        `${API_URL}/host-bookings?studioId=${studio._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to load bookings")
      }

      setStudioBookings(result.bookings || [])
    } catch (error) {
      console.log("Host Bookings Error:", error)

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load bookings"
      )
    } finally {
      setIsBookingsLoading(false)
    }
  }

  // Approve or reject a booking request
  const handleBookingAction = async (
    bookingId: string,
    action: "approve" | "reject"
  ) => {
    if (!userEmail) return

    try {
      setBookingActionId(bookingId)

      const token = await getTokenFromClient()

      if (!token) {
        throw new Error("Please login again.")
      }

      const response = await fetch(
        `${API_URL}/bookings/${bookingId}/${action}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ hostEmail: userEmail }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || `Failed to ${action} booking`)
      }

      setStudioBookings((previous) =>
        previous.map((booking) =>
          booking._id === bookingId
            ? {
                ...booking,
                status: action === "approve" ? "Confirmed" : "Cancelled",
              }
            : booking
        )
      )

      toast.success(
        result.message ||
          (action === "approve" ? "Booking approved!" : "Booking rejected!")
      )
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      )
    } finally {
      setBookingActionId(null)
    }
  }

  const formatBookingDate = (date: string) => {
    if (!date) return "Date unavailable"

    return new Date(`${date.slice(0, 10)}T12:00:00`).toLocaleDateString(
      "en-US",
      { month: "short", day: "numeric", year: "numeric" }
    )
  }

  // Loading
  if (isSessionLoading || isLoading) {
    return (
      <main className="min-h-screen bg-background px-4 py-10 transition-colors duration-300">
        <div className="mx-auto max-w-7xl animate-pulse space-y-5">
          <div className="h-10 w-64 rounded-lg bg-muted" />
          <div className="h-36 rounded-xl bg-muted" />
          <div className="h-36 rounded-xl bg-muted" />
          <div className="h-36 rounded-xl bg-muted" />
        </div>
      </main>
    )
  }

  // Login required
  if (!userEmail) {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-background px-4">
        <div className="text-center">
          <Building2 className="mx-auto size-12 text-muted-foreground" />

          <h2 className="mt-4 text-xl font-bold text-foreground">
            Login Required
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Please login to manage your studio listings.
          </p>

          <Link
            href="/login"
            className="mt-5 inline-flex items-center justify-center rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-strong"
          >
            Login
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Page Heading */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-xs text-brand">
              Host Dashboard / My Listings
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              My Studio Listings
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Manage your creative spaces and keep your listings updated.
            </p>
          </div>

          <Link
            href="/add-studio"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-strong"
          >
            <Plus className="size-4" />
            Add New Studio
          </Link>
        </div>

        {/* Statistics */}
        <Card className="mb-6 rounded-2xl border-border bg-card text-card-foreground shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="grid size-12 place-items-center rounded-xl bg-brand-soft text-brand">
              <Building2 className="size-6" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Total Studio Listings
              </p>

              <p className="text-2xl font-bold text-foreground">
                {studios.length}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Studio Listings */}
        {studios.length > 0 ? (
          <div className="space-y-4">
            {studios.map((studio) => (
              <Card
                key={studio._id}
                className="overflow-hidden rounded-2xl border-border bg-card text-card-foreground shadow-sm transition hover:shadow-md"
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row">

                    {/* Studio Image */}
                    <div className="h-48 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:h-36 sm:w-52">
                      {studio.images?.[0] ? (
                        <img
                          src={studio.images[0]}
                          alt={studio.title}
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center">
                          <ImageIcon className="size-10 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Studio Information */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-bold text-card-foreground">
                          {studio.title}
                        </h2>

                        <Badge className="border-0 bg-brand-soft text-brand hover:bg-brand-soft">
                          {studio.category}
                        </Badge>
                      </div>

                      <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="size-4 text-brand" />
                        {studio.location}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                        <span className="font-semibold text-brand">
                          ${studio.hourlyRate}/hour
                        </span>

                        <span>
                          Deposit: ${studio.securityDeposit}
                        </span>

                        <span className="flex items-center gap-1">
                          <Users className="size-3.5" />
                          {studio.capacity} people
                        </span>

                        <span>
                          {studio.images?.length || 0} photos
                        </span>
                      </div>

                      {/* Amenities */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {studio.amenities?.slice(0, 4).map((amenity) => (
                          <span
                            key={amenity}
                            className="rounded-full bg-secondary px-2.5 py-1 text-[10px] text-secondary-foreground"
                          >
                            {amenity.replaceAll("-", " ")}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 flex-row gap-2 sm:flex-col sm:justify-center">
                      <Link
                        href={`/studios/edit/${studio._id}`}
                        className="flex flex-1 items-center justify-center rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-strong sm:flex-none"
                      >
                        <Pencil className="mr-1.5 size-3.5" />
                        Update
                      </Link>

                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewBookings(studio)}
                        className="flex-1 rounded-lg border-border text-foreground hover:bg-accent sm:flex-none"
                      >
                        <CalendarDays className="mr-1.5 size-3.5" />
                        View Bookings

                        <ChevronDown
                          className={`ml-1 size-3.5 transition-transform ${
                            openStudioId === studio._id ? "rotate-180" : ""
                          }`}
                        />
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteId(studio._id)}
                        className="flex-1 rounded-lg border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10 sm:flex-none"
                      >
                        <Trash2 className="mr-1.5 size-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>

                  {/* Booking Requests */}
                  {openStudioId === studio._id && (
                    <div className="mt-5 border-t border-border pt-5">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-bold text-foreground">
                          Booking Requests
                        </h3>

                        <Badge className="border-0 bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
                          {studioBookings.filter(
                            (booking) => booking.status === "Pending"
                          ).length} Pending
                        </Badge>
                      </div>

                      {isBookingsLoading ? (
                        <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
                          <Loader2 className="size-4 animate-spin" />
                          Loading booking requests...
                        </div>
                      ) : studioBookings.length === 0 ? (
                        <p className="rounded-lg bg-muted p-5 text-center text-sm text-muted-foreground">
                          No booking requests for this studio yet.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {studioBookings.map((booking) => (
                            <div
                              key={booking._id}
                              className="rounded-xl border border-border bg-background p-4"
                            >
                              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                                <div className="space-y-2">
                                  <p className="text-sm font-semibold text-foreground">
                                    {booking.customerEmail}
                                  </p>

                                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <CalendarDays className="size-3.5" />
                                      {formatBookingDate(booking.bookingDate)}
                                    </span>

                                    <span className="flex items-center gap-1">
                                      <Clock className="size-3.5" />
                                      {booking.startTime} - {booking.endTime}
                                    </span>

                                    <span>
                                      {Number(booking.totalHours).toFixed(2)} hrs
                                    </span>

                                    <span className="font-semibold text-foreground">
                                      ${Number(booking.totalPrice).toFixed(2)}
                                    </span>
                                  </div>
                                </div>

                                <Badge
                                  className={`w-fit border-0 ${bookingStatusStyle[booking.status]}`}
                                >
                                  {booking.status}
                                </Badge>
                              </div>

                              {/* Approve / Reject */}
                              {booking.status === "Pending" && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                  <Button
                                    size="sm"
                                    disabled={bookingActionId === booking._id}
                                    onClick={() =>
                                      handleBookingAction(booking._id, "approve")
                                    }
                                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                                  >
                                    {bookingActionId === booking._id ? (
                                      <Loader2 className="mr-1.5 size-4 animate-spin" />
                                    ) : (
                                      <CheckCircle2 className="mr-1.5 size-4" />
                                    )}
                                    Approve
                                  </Button>

                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={bookingActionId === booking._id}
                                    onClick={() =>
                                      handleBookingAction(booking._id, "reject")
                                    }
                                    className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
                                  >
                                    <XCircle className="mr-1.5 size-4" />
                                    Reject
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          !error && (
            <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-20 text-center">
              <Building2 className="mx-auto size-12 text-muted-foreground" />

              <h2 className="mt-4 text-xl font-bold text-foreground">
                No Studio Listings Yet
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                You haven't added any creative spaces yet.
                Start by listing your first studio.
              </p>

              <Link
                href="/add-studio"
                className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-strong"
              >
                <Plus className="size-4" />
                Add Your First Studio
              </Link>
            </div>
          )
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setDeleteId(null)
          }
        }}
      >
        <DialogContent className="rounded-2xl border-border bg-card text-card-foreground sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              Delete Studio Listing?
            </DialogTitle>
          </DialogHeader>

          <div className="py-2">
            <div className="mb-3 grid size-12 place-items-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400">
              <Trash2 className="size-5" />
            </div>

            <p className="text-sm leading-6 text-muted-foreground">
              Are you sure you want to delete this studio?
              This action cannot be undone.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => setDeleteId(null)}
            >
              Cancel
            </Button>

            <Button
              type="button"
              disabled={isDeleting}
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 size-4" />
                  Yes, Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
