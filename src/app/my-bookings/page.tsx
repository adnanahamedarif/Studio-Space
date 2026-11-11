
"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import toast from "react-hot-toast"
import { authClient } from "@/lib/auth-client"

import {
  Search,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  XCircle,
  CheckCircle2,
  Clock3,
  MessageCircle,
  ExternalLink,
  Receipt,
  Star,
  RefreshCw,
  Loader2,
  CalendarCheck,
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
import router from "next/router"

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
  Pending: "bg-amber-100 text-amber-700",
  Confirmed: "bg-emerald-100 text-emerald-700",
  Completed: "bg-violet-100 text-violet-700",
  Cancelled: "bg-red-100 text-red-700",
}

export default function MyBookingsPage() {
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

  // Fetch bookings
  useEffect(() => {
    if (isSessionLoading) return

    if (!userEmail) {
      setBookings([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError("")

    fetch(
      `${API_URL}/my-bookings?email=${encodeURIComponent(userEmail)}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load bookings")
        return res.json()
      })
      .then((result) => {
        setBookings(result.bookings || [])
      })
      .catch((error) => {
        setError(error.message || "Something went wrong")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [userEmail, isSessionLoading])

  // Filter and sort
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

  // Cancel booking

  const handleCancel = () => {
    if (!cancelId || !userEmail) return

    setIsCancelling(true)

    fetch(`${API_URL}/bookings/${cancelId}/cancel`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerEmail: userEmail,
      }),
    })
      .then(async (res) => {
        const result = await res.json()

        if (!res.ok) {
          throw new Error(result.message || "Cancellation failed")
        }

        return result
      })
      .then((result) => {
        setBookings((previous) =>
          previous.map((booking) =>
            booking._id === cancelId
              ? { ...booking, status: "Cancelled" }
              : booking
          )
        )

        toast.success(result.message || "Booking cancelled!")
        setCancelId(null)
      })
      .catch((error) => {
        toast.error(error.message || "Something went wrong")
      })
      .finally(() => {
        setIsCancelling(false)
      })
  }


  if (isSessionLoading || isLoading) {
    return (
      <main className="min-h-screen bg-[#faf9ff] p-5">
        <div className="mx-auto max-w-7xl animate-pulse space-y-4">
          <div className="h-12 w-60 rounded-lg bg-slate-200" />
          <div className="h-16 rounded-xl bg-slate-200" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-36 rounded-xl bg-slate-200" />
          ))}
        </div>
      </main>
    )
  }

  if (!userEmail) {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-[#faf9ff]">
        <div className="text-center">
          <CalendarDays className="mx-auto size-12 text-slate-300" />
          <h2 className="mt-4 text-xl font-bold">Login Required</h2>
          <p className="mt-2 text-sm text-slate-500">
            Login to see your bookings.
          </p>
          <Button asChild className="mt-4 bg-violet-700">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </main>
    )
  }

  const tabs = ["All", "Pending", "Confirmed", "Completed", "Cancelled"]

  return (
    <main className="min-h-screen bg-[#faf9ff]">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs text-violet-600">
              Creator Dashboard / My Bookings
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              My Bookings
            </h1>

            <p className="mt-1 max-w-lg text-xs text-slate-500">
              Review, manage, or cancel your upcoming and past studio
              reservations with instant host coordination.
            </p>
          </div>

          <div className="flex gap-2">
            <div className="rounded-lg border bg-white px-4 py-2 text-right shadow-sm">
              <p className="text-xs font-bold uppercase text-slate-400">
                Reserved Hours
              </p>
              <p className="text-base font-bold text-violet-700">
                {totalHours} hrs
              </p>
            </div>

            <div className="rounded-lg border bg-white px-4 py-2 text-right shadow-sm">
              <p className="text-xs font-bold uppercase text-slate-400">
                Total Spend
              </p>
              <p className="text-base font-bold text-slate-900">
                ${totalSpend.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-3 overflow-x-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-auto w-max gap-1 rounded-xl bg-white p-1 shadow-sm">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="rounded-lg px-3 py-2 text-sm data-[state=active]:bg-violet-700 data-[state=active]:text-white"
                >
                  {tab} ({getCount(tab)})
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Search and Sort */}
        <div className="mb-4 flex flex-col gap-2 rounded-xl border bg-white p-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by studio name or ID..."
              className="h-9 border-0 bg-[#f7f6fc] pl-9 text-sm shadow-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold uppercase text-slate-400">
              Sort by
            </span>

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-9 w-[190px] border-0 bg-[#f7f6fc] text-sm">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="upcoming">Reservation Date (Upcoming first)</SelectItem>
                <SelectItem value="newest">Recently Requested</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Count */}
        <div className="mb-3 flex justify-between text-xs text-slate-500">
          <p>
            {filteredBookings.length} results
            {activeTab !== "All" && ` • ${activeTab}`}
          </p>

          <Link
            href="/studios"
            className="flex items-center gap-1 font-semibold text-violet-700 hover:underline"
          >
            Explore More Studios
            <ExternalLink className="size-3" />
          </Link>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs text-red-600">
            {error}
          </div>
        )}

        {/* Booking List */}
        <div className="space-y-3">
          {filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition hover:shadow-md sm:p-4"
            >

              {/* Top information */}
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <p className="text-sm text-slate-400">
                  <span className="font-bold text-violet-700">
                    #{booking._id.slice(-6)}
                  </span>
                  <span className="mx-2">•</span>
                  Requested on {formatDate(booking.createdAt)}
                </p>

                <Badge
                  className={`rounded-full border-0 px-2.5 py-1 text-sm ${statusStyle[booking.status]}`}
                >
                  {booking.status === "Pending" && <Clock3 className="mr-1 size-3" />}
                  {booking.status === "Confirmed" && <CheckCircle2 className="mr-1 size-3" />}
                  {booking.status === "Completed" && <CalendarCheck className="mr-1 size-3" />}
                  {booking.status === "Cancelled" && <XCircle className="mr-1 size-3" />}
                  {booking.status}
                  {booking.status === "Pending" && " Host Approval"}
                </Badge>
              </div>

              {/* Main content */}
              <div className="flex flex-col gap-3 sm:flex-row">

                {/* Image */}
                <div className="h-32 w-full shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:h-[105px] sm:w-[145px]">
                  {booking.studioImage ? (
                    <img
                      src={booking.studioImage}
                      alt={booking.studioTitle}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="grid size-full place-items-center">
                      <CalendarDays className="size-8 text-slate-300" />
                    </div>
                  )}
                </div>

                {/* Information */}
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-bold text-slate-900">
                    {booking.studioTitle}
                  </h2>

                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="size-3 text-violet-600" />
                    {booking.location}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="size-3 text-violet-600" />
                      {formatDate(booking.bookingDate)}
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock className="size-3 text-violet-600" />
                      {booking.startTime} - {booking.endTime}
                    </span>

                    <span className="flex items-center gap-1">
                      <Users className="size-3 text-violet-600" />
                      {booking.totalHours} hrs
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {booking.status === "Pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCancelId(booking._id)}
                        className="h-9 rounded-md border-red-200 px-3 text-sm text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="mr-1.5 size-4" />
                        Cancel Booking
                      </Button>
                    )}

                    {booking.status === "Confirmed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="h-9 rounded-md px-3 text-sm"
                      >
                        <a href={`mailto:${booking.hostEmail}`}>
                          <MessageCircle className="mr-1.5 size-4" />
                          Message Host
                        </a>
                      </Button>
                    )}

                    {booking.status === "Completed" && (
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="h-9 rounded-md px-3 text-sm"
                      >
                        <Link href={`/studios/${booking.studioId}`}>
                          <Star className="mr-1.5 size-4" />
                          Leave a Review
                        </Link>
                      </Button>
                    )}

                    {booking.status === "Cancelled" && (
                      <span className="text-sm text-red-500">
                        Reservation cancelled.
                      </span>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 min-w-[90px] flex-row items-center justify-center gap-1.5 whitespace-nowrap px-3 text-sm"
                      onClick={() => router.push(`/studios/${booking.studioId}`)}
                    >
                      <ExternalLink size={16} className="shrink-0" />
                      <span>Details</span>
                    </Button>

                    {booking.status === "Cancelled" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-9 min-w-[110px] flex-row items-center justify-center gap-1.5 whitespace-nowrap px-3 text-sm"
                        onClick={() => router.push(`/studios/${booking.studioId}`)}
                      >
                        <RefreshCw size={16} className="shrink-0" />
                        <span>Book Again</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="flex shrink-0 items-center justify-between border-t pt-2 sm:min-w-[120px] sm:flex-col sm:items-end sm:justify-start sm:border-l sm:border-t-0 sm:pt-0 sm:pl-4">
                  <div className="text-left sm:text-right">
                    <p className="text-xs font-bold uppercase text-slate-400">
                      {booking.status === "Completed" ? "Paid in Full" : "Total Hold"}
                    </p>

                    <p className="text-xl font-bold text-slate-900">
                      ${booking.totalPrice}
                    </p>

                    <p className="text-sm text-slate-500">
                      ${booking.hourlyRate}/hr × {booking.totalHours} hrs
                    </p>

                    <p className="text-sm text-slate-500">
                      Deposit: ${booking.securityDeposit}
                    </p>
                  </div>

                  {booking.status === "Confirmed" && (
                    <span className="mt-2 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                      Confirmed & Paid
                    </span>
                  )}

                  {booking.status === "Pending" && (
                    <span className="mt-2 text-xs text-amber-600">
                      Awaiting host approval
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom note */}
              <div className="mt-3 border-t border-slate-100 pt-2">
                {booking.status === "Pending" && (
                  <p className="text-sm text-amber-700">
                    <Clock3 className="mr-1 inline size-3" />
                    You can modify or cancel your request before host confirmation.
                  </p>
                )}

                {booking.status === "Confirmed" && (
                  <p className="text-sm text-emerald-700">
                    <CheckCircle2 className="mr-1 inline size-3" />
                    Your reservation is confirmed. Contact your host for check-in details.
                  </p>
                )}

                {booking.status === "Completed" && (
                  <p className="text-sm text-violet-700">
                    <CheckCircle2 className="mr-1 inline size-3" />
                    Booking completed. Share your feedback with the host.
                  </p>
                )}

                {booking.status === "Cancelled" && (
                  <p className="text-sm text-red-600">
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
          <div className="rounded-xl border border-dashed bg-white px-5 py-16 text-center">
            <CalendarDays className="mx-auto size-10 text-slate-300" />

            <h2 className="mt-3 text-lg font-bold text-slate-900">
              No bookings found
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Try another filter or explore available studios.
            </p>

            <Button asChild className="mt-4 bg-violet-700">
              <Link href="/studios">Explore Studios</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Cancel Modal */}
      <Dialog
        open={Boolean(cancelId)}
        onOpenChange={(open) => {
          if (!open && !isCancelling) setCancelId(null)
        }}
      >
        <DialogContent className="rounded-xl sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Cancel Booking?</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-slate-500">
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
              className="bg-red-600 hover:bg-red-700"
            >
              {isCancelling ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <XCircle className="mr-2 size-4" />
              )}
              Confirm Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
