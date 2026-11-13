
"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

import { authClient } from "@/lib/auth-client"
import { getTokenFromClient } from "@/lib/getTokenFromClient"

import {
  Search,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  XCircle,
  CheckCircle2,
  Clock3,
  ExternalLink,
  RefreshCw,
  Loader2,
  CalendarCheck,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"





type Booking = {
  _id: string
  studioId: string
  studioTitle: string
  studioImage: string
  location: string
  customerEmail: string
  hostEmail: string
  bookingDate: string
  startTime: string
  endTime: string
  totalHours: number
  hourlyRate: number
  securityDeposit: number
  totalPrice: number
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled"
  createdAt: string
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const statusStyle = {
  Pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  Confirmed:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  Completed:
    "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
  Cancelled:
    "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
}

export default function MyBookingsPage() {
  const router = useRouter()

  const { data: session, isPending: isSessionLoading } =
    authClient.useSession()

  const userEmail = session?.user?.email

  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const [activeTab, setActiveTab] = useState("All")
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("upcoming")

  const [cancelId, setCancelId] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch Bookings
const fetchBookings = useCallback(async () => {
  if (!userEmail) {
    setBookings([])
    setIsLoading(false)
    return
  }

  try {
    setIsLoading(true)
    setError("")

    const token = await getTokenFromClient()

    if (!token) {
      throw new Error("Authentication token not found")
    }

    const response = await fetch(`${API_URL}/my-bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to load bookings")
    }

    const result = await response.json()
    setBookings(result.bookings || [])
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Something went wrong"
    )
  } finally {
    setIsLoading(false)
  }
}, [userEmail])

  useEffect(() => {
    if (!isSessionLoading) {
      fetchBookings()
    }
  }, [isSessionLoading, fetchBookings])

  // Filter and Sort
  const filteredBookings = useMemo(() => {
    let result = [...bookings]

    if (activeTab !== "All") {
      result = result.filter(
        (booking) => booking.status === activeTab
      )
    }

    if (search.trim()) {
      const keyword = search.toLowerCase()

      result = result.filter((booking) =>
        `${booking.studioTitle} ${booking.location} ${booking._id}`
          .toLowerCase()
          .includes(keyword)
      )
    }

    if (sort === "upcoming") {
      result.sort(
        (a, b) =>
          new Date(a.bookingDate).getTime() -
          new Date(b.bookingDate).getTime()
      )
    }

    if (sort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
    }

    if (sort === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      )
    }

    if (sort === "price-high") {
      result.sort((a, b) => b.totalPrice - a.totalPrice)
    }

    return result
  }, [bookings, activeTab, search, sort])

  // Statistics
  const totalHours = bookings.reduce(
    (total, booking) =>
      total + Number(booking.totalHours || 0),
    0
  )

  const totalSpend = bookings
    .filter(
      (booking) =>
        booking.status === "Confirmed" ||
        booking.status === "Completed"
    )
    .reduce(
      (total, booking) =>
        total + Number(booking.totalPrice || 0),
      0
    )

  const getCount = (status: string) => {
    if (status === "All") return bookings.length

    return bookings.filter(
      (booking) => booking.status === status
    ).length
  }

  const formatDate = (date: string) => {
    if (!date) return "Date unavailable"

    return new Date(
      `${date.slice(0, 10)}T12:00:00`
    ).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Cancel Booking
  const handleCancel = async () => {
    if (!cancelId || !userEmail) return

    try {
      setIsCancelling(true)

      const token = await getTokenFromClient()

      if (!token) {
        throw new Error("Unable to get JWT token. Please login again.")
      }

      const response = await fetch(
        `${API_URL}/bookings/${cancelId}/cancel`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            customerEmail: userEmail,
          }),
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Cancellation failed")
      }

      setBookings((previous) =>
        previous.map((booking) =>
          booking._id === cancelId
            ? { ...booking, status: "Cancelled" }
            : booking
        )
      )

      toast.success(result.message || "Booking cancelled!")
      setCancelId(null)
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      )
    } finally {
      setIsCancelling(false)
    }
  }

  // Delete Booking
  const handleDelete = async () => {
    if (!deleteId || !userEmail) return

    try {
      setIsDeleting(true)

      const token = await getTokenFromClient()

      if (!token) {
        throw new Error("Unable to get JWT token. Please login again.")
      }

      const response = await fetch(
        `${API_URL}/bookings/${deleteId}?email=${encodeURIComponent(userEmail)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const result = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to delete booking"
        )
      }

      setBookings((previous) =>
        previous.filter((booking) => booking._id !== deleteId)
      )

      toast.success(result?.message || "Booking deleted successfully!")
      setDeleteId(null)
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      )
    } finally {
      setIsDeleting(false)
    }
  }

  // Loading State
  if (isSessionLoading || isLoading) {
    return (
      <main className="min-h-screen bg-background p-5 transition-colors duration-300">
        <div className="mx-auto max-w-7xl animate-pulse space-y-4">
          <div className="h-12 w-60 rounded-lg bg-muted" />
          <div className="h-16 rounded-xl bg-muted" />

          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-36 rounded-xl bg-muted"
            />
          ))}
        </div>
      </main>
    )
  }

  // Login Required
  if (!userEmail) {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-background px-4">
        <div className="text-center">
          <CalendarDays className="mx-auto size-12 text-muted-foreground" />

          <h2 className="mt-4 text-xl font-bold text-foreground">
            Login Required
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Login to see your bookings.
          </p>

          <Button
            nativeButton={false}
            render={<Link href="/login" />}
            className="mt-4 bg-brand text-white hover:bg-brand-strong"
          >
            Login
          </Button>
        </div>
      </main>
    )
  }

  const tabs = [
    "All",
    "Pending",
    "Confirmed",
    "Completed",
    "Cancelled",
  ]

  return (
    <main className="min-h-screen bg-background transition-colors duration-300">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs text-brand">
              Creator Dashboard / My Bookings
            </p>

            <h1 className="mt-1 text-3xl font-bold text-foreground">
              My Bookings
            </h1>

            <p className="mt-1 max-w-lg text-xs text-muted-foreground">
              Review, manage, or cancel your upcoming and past studio
              reservations with instant host coordination.
            </p>
          </div>

          {/* Statistics */}
          <div className="flex gap-2">
            <div className="rounded-lg border border-border bg-card px-4 py-2 text-right shadow-sm">
              <p className="text-xs font-bold uppercase text-muted-foreground">
                Reserved Hours
              </p>

              <p className="text-base font-bold text-brand">
                {totalHours.toFixed(2)} hrs
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card px-4 py-2 text-right shadow-sm">
              <p className="text-xs font-bold uppercase text-muted-foreground">
                Total Spend
              </p>

              <p className="text-base font-bold text-foreground">
                ${totalSpend.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-3 overflow-x-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-auto w-max gap-1 rounded-xl border border-border bg-card p-1 shadow-sm">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground data-[state=active]:bg-brand data-[state=active]:text-white"
                >
                  {tab} ({getCount(tab)})
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Search and Sort */}
        <div className="mb-4 flex flex-col gap-2 rounded-xl border border-border bg-card p-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by studio name or ID..."
              className="h-9 border-0 bg-muted pl-9 text-sm text-foreground shadow-none placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold uppercase text-muted-foreground">
              Sort by
            </span>

            <Select
              value={sort}
              onValueChange={(value) => {
                if (value !== null) {
                  setSort(value)
                }
              }}
            >
              <SelectTrigger className="h-9 w-[190px] border-0 bg-muted text-sm text-foreground">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="upcoming">
                  Reservation Date (Upcoming first)
                </SelectItem>

                <SelectItem value="newest">
                  Recently Requested
                </SelectItem>

                <SelectItem value="oldest">
                  Oldest First
                </SelectItem>

                <SelectItem value="price-high">
                  Price: High to Low
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Count */}
        <div className="mb-3 flex justify-between text-xs text-muted-foreground">
          <p>
            {filteredBookings.length} results
            {activeTab !== "All" && ` • ${activeTab}`}
          </p>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={fetchBookings}
              disabled={isLoading}
              className="border-border"
            >
              <RefreshCw
                className={`mr-1.5 size-3 ${isLoading ? "animate-spin" : ""
                  }`}
              />
              Refresh
            </Button>

            <Link
              href="/studios"
              className="flex items-center gap-1 font-semibold text-brand hover:underline"
            >
              Explore More Studios
              <ExternalLink className="size-3" />
            </Link>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Booking List */}
        <div className="space-y-3">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="rounded-xl border border-border bg-card p-3 text-card-foreground shadow-sm transition hover:shadow-md sm:p-4"
            >

              {/* Top Information */}
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
                <p className="text-sm text-muted-foreground">
                  <span className="font-bold text-brand">
                    #{booking._id.slice(-6)}
                  </span>

                  <span className="mx-2">•</span>

                  Requested on {formatDate(booking.createdAt)}
                </p>

                <Badge
                  className={`rounded-full border-0 px-2.5 py-1 text-sm ${statusStyle[booking.status]}`}
                >
                  {booking.status === "Pending" && (
                    <Clock3 className="mr-1 size-3" />
                  )}

                  {booking.status === "Confirmed" && (
                    <CheckCircle2 className="mr-1 size-3" />
                  )}

                  {booking.status === "Completed" && (
                    <CalendarCheck className="mr-1 size-3" />
                  )}

                  {booking.status === "Cancelled" && (
                    <XCircle className="mr-1 size-3" />
                  )}

                  {booking.status}

                  {booking.status === "Pending" && " Host Approval"}
                </Badge>
              </div>

              {/* Main Content */}
              <div className="flex flex-col gap-3 sm:flex-row">

                {/* Image */}
                <div className="h-32 w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:h-[105px] sm:w-[145px]">
                  {booking.studioImage ? (
                    <img
                      src={booking.studioImage}
                      alt={booking.studioTitle}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="grid size-full place-items-center">
                      <CalendarDays className="size-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Information */}
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-bold text-foreground">
                    {booking.studioTitle}
                  </h2>

                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3 text-brand" />
                    {booking.location}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="size-3 text-brand" />
                      {formatDate(booking.bookingDate)}
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock className="size-3 text-brand" />
                      {booking.startTime} - {booking.endTime}
                    </span>

                    <span className="flex items-center gap-1">
                      <Users className="size-3 text-brand" />
                      {Number(booking.totalHours).toFixed(2)} hrs
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {booking.status === "Pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCancelId(booking._id)}
                        className="h-9 rounded-md border-red-200 px-3 text-sm text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
                      >
                        <XCircle className="mr-1.5 size-4" />
                        Cancel Booking
                      </Button>
                    )}

                    {booking.status === "Cancelled" && (
                      <span className="text-sm text-red-500 dark:text-red-400">
                        Reservation cancelled.
                      </span>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 min-w-[90px] flex-row items-center justify-center gap-1.5 whitespace-nowrap border-border px-3 text-sm"
                      onClick={() =>
                        router.push(`/studios/${booking.studioId}`)
                      }
                    >
                      <ExternalLink size={16} className="shrink-0" />
                      <span>Details</span>
                    </Button>

                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      aria-label="Delete booking"
                      title="Delete booking"
                      onClick={() => setDeleteId(booking._id)}
                      className="size-9 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
                    >
                      <Trash2 className="size-4" />
                    </Button>

                    {booking.status === "Cancelled" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-9 min-w-[110px] flex-row items-center justify-center gap-1.5 whitespace-nowrap border-border px-3 text-sm"
                        onClick={() =>
                          router.push(`/studios/${booking.studioId}`)
                        }
                      >
                        <RefreshCw size={16} className="shrink-0" />
                        <span>Book Again</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="flex shrink-0 items-center justify-between border-t border-border pt-2 sm:min-w-[120px] sm:flex-col sm:items-end sm:justify-start sm:border-t-0 sm:border-l sm:pt-0 sm:pl-4">
                  <div className="text-left sm:text-right">
                    <p className="text-xs font-bold uppercase text-muted-foreground">
                      {booking.status === "Completed"
                        ? "Paid in Full"
                        : "Total Hold"}
                    </p>

                    <p className="text-xl font-bold text-foreground">
                      ${Number(booking.totalPrice).toFixed(2)}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      ${booking.hourlyRate}/hr ×{" "}
                      {Number(booking.totalHours).toFixed(2)} hrs
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Deposit: $
                      {Number(booking.securityDeposit).toFixed(2)}
                    </p>
                  </div>

                  {booking.status === "Confirmed" && (
                    <span className="mt-2 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                      Confirmed & Paid
                    </span>
                  )}

                  {booking.status === "Pending" && (
                    <span className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                      Awaiting host approval
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Note */}
              <div className="mt-3 border-t border-border pt-2">
                {booking.status === "Pending" && (
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    <Clock3 className="mr-1 inline size-3" />
                    You can modify or cancel your request before host confirmation.
                  </p>
                )}

                {booking.status === "Confirmed" && (
                  <p className="text-sm text-emerald-700 dark:text-emerald-400">
                    <CheckCircle2 className="mr-1 inline size-3" />
                    Your reservation is confirmed. Contact your host for check-in details.
                  </p>
                )}

                {booking.status === "Completed" && (
                  <p className="text-sm text-violet-700 dark:text-violet-400">
                    <CheckCircle2 className="mr-1 inline size-3" />
                    Booking completed. Share your feedback with the host.
                  </p>
                )}

                {booking.status === "Cancelled" && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    <XCircle className="mr-1 inline size-3" />
                    This reservation has been cancelled.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 && !error && (
          <div className="rounded-xl border border-dashed border-border bg-card px-5 py-16 text-center">
            <CalendarDays className="mx-auto size-10 text-muted-foreground" />

            <h2 className="mt-3 text-lg font-bold text-foreground">
              No bookings found
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Try another filter or explore available studios.
            </p>

            <Button
              nativeButton={false}
              render={<Link href="/studios" />}
              className="mt-4 bg-brand text-white hover:bg-brand-strong"
            >
              Explore Studios
            </Button>
          </div>
        )}
      </div>

      {/* Delete Booking Confirmation */}
      <Dialog
        open={Boolean(deleteId)}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setDeleteId(null)
        }}
      >
        <DialogContent className="rounded-xl border-border bg-card text-card-foreground sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Delete Booking?
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Are you sure you want to permanently delete this booking from the
            database? This action cannot be undone.
          </p>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isDeleting}
              onClick={() => setDeleteId(null)}
            >
              Keep Booking
            </Button>

            <Button
              type="button"
              disabled={isDeleting}
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isDeleting ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 size-4" />
              )}

              {isDeleting ? "Deleting..." : "Delete Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Booking Confirmation */}
      <Dialog
        open={Boolean(cancelId)}
        onOpenChange={(open) => {
          if (!open && !isCancelling) setCancelId(null)
        }}
      >
        <DialogContent className="rounded-xl border-border bg-card text-card-foreground sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Cancel Booking?
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground">
            Are you sure you want to cancel this booking request?
            This action cannot be undone.
          </p>

          <DialogFooter>
            <Button
              variant="outline"
              disabled={isCancelling}
              onClick={() => setCancelId(null)}
            >
              Keep Booking
            </Button>

            <Button
              disabled={isCancelling}
              onClick={handleCancel}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isCancelling ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <XCircle className="mr-2 size-4" />
              )}

              {isCancelling ? "Cancelling..." : "Confirm Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
