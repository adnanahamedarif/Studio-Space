
"use client"

import { useEffect, useState, type FormEvent } from "react"
import { useParams } from "next/navigation"
import toast from "react-hot-toast"
import { authClient } from "@/lib/auth-client"

import {
  Loader2,
  MapPin,
  Users,
  CalendarDays,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getTokenFromClient } from "@/lib/getTokenFromClient"

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
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

const amenityLabels: Record<string, string> = {
  "lighting-kit": "Professional Lighting Kit",
  "cyclorama-wall": "Cyclorama Wall",
  "high-speed-wifi": "High-Speed Wi-Fi",
  "sound-insulation": "Sound Insulation",
  diffusers: "Light Diffusers",
  "loading-bay": "Loading Bay",
  "ac-heating": "Air Conditioning & Heating",
  parking: "Parking",
}

export default function StudioDetailsPage() {
  const params = useParams()
  const id = params.id as string

  const [studio, setStudio] = useState<Studio | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const [activeImage, setActiveImage] = useState(0)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [isBooking, setIsBooking] = useState(false)

  const [booking, setBooking] = useState({
    date: "",
    startTime: "",
    endTime: "",
    message: "",
  })

  const { data: session } = authClient.useSession()

  // Fetch Studio
  useEffect(() => {
    if (!id) return

    const fetchStudio = async () => {
      try {
        setIsLoading(true)
        setError("")

        const response = await fetch(`${API_URL}/studios/${id}`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || "Studio not found")
        }

        const studioData = result.studio || result

        setStudio(studioData)
        setActiveImage(0)
      } catch (error) {
        console.error("Fetch studio error:", error)

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchStudio()
  }, [id])

  // Calculate Booking Hours
  const getBookingHours = () => {
    if (!booking.startTime || !booking.endTime) return 0

    const start = booking.startTime.split(":").map(Number)
    const end = booking.endTime.split(":").map(Number)

    const startMinutes = start[0] * 60 + start[1]
    const endMinutes = end[0] * 60 + end[1]

    return Math.max(0, (endMinutes - startMinutes) / 60)
  }

  const bookingHours = getBookingHours()

  const totalPrice = studio
    ? bookingHours * studio.hourlyRate
    : 0

  // Submit Booking
  const handleBookingSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()

    if (!session?.user?.email) {
      toast.error("Please login before booking")
      return
    }

    if (!booking.date || !booking.startTime || !booking.endTime) {
      toast.error("Please complete all booking details.")
      return
    }

    if (bookingHours <= 0) {
      toast.error("End time must be later than start time.")
      return
    }

    try {
      setIsBooking(true)

      const token = await getTokenFromClient()

      const response = await fetch(`${API_URL}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studioId: studio?._id,
          customerEmail: session.user.email,
          bookingDate: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          message: booking.message,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Booking failed")
      }

      toast.success(result.message || "Booking request submitted!")

      setBooking({
        date: "",
        startTime: "",
        endTime: "",
        message: "",
      })

      setBookingOpen(false)
    } catch (error) {
      console.error("Booking error:", error)

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      )
    } finally {
      setIsBooking(false)
    }
  }

  // Loading State
  if (isLoading) {
    return (
      <main className="min-h-screen bg-background px-4 py-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="aspect-[16/7] rounded-2xl bg-muted" />

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="h-40 rounded-2xl bg-muted" />
            <div className="h-64 rounded-2xl bg-muted" />
          </div>
        </div>
      </main>
    )
  }

  // Error State
  if (error || !studio) {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-background px-4">
        <div className="text-center">
          <ImageIcon className="mx-auto size-12 text-muted-foreground" />

          <h2 className="mt-4 text-xl font-bold text-foreground">
            Studio not found
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {error || "This studio may have been removed."}
          </p>

          <Button
            className="mt-5 bg-brand text-white hover:bg-brand-strong"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </main>
    )
  }

  const images = studio.images || []

  return (
    <main className="min-h-screen bg-background transition-colors duration-300">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>Explore Studios</span>
          <span>/</span>
          <span>{studio.category}</span>
          <span>/</span>
          <span className="font-medium text-brand">
            {studio.title}
          </span>
        </div>

        {/* Studio Heading */}
        <div className="mb-5">
          <Badge className="mb-3 bg-brand-soft text-brand hover:bg-brand-soft">
            {studio.category}
          </Badge>

          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {studio.title}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4 text-brand" />
              {studio.location}
            </span>

            <span className="flex items-center gap-1.5">
              <Users className="size-4 text-brand" />
              Up to {studio.capacity} people
            </span>
          </div>
        </div>

        {/* Image Gallery */}
        <section className="mb-8">
          {images.length > 0 ? (
            <>
              <div className="group relative aspect-[16/8] overflow-hidden rounded-2xl bg-muted shadow-sm">
                <img
                  src={images[activeImage]}
                  alt={studio.title}
                  className="size-full object-cover"
                />

                <div className="absolute right-4 bottom-4 rounded-md bg-black/60 px-3 py-1.5 text-xs font-medium text-white">
                  Photo {activeImage + 1} of {images.length}
                </div>

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Previous image"
                      onClick={() =>
                        setActiveImage((previous) =>
                          previous === 0
                            ? images.length - 1
                            : previous - 1
                        )
                      }
                      className="absolute top-1/2 left-3 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-900 shadow transition hover:bg-white"
                    >
                      <ChevronLeft className="size-5" />
                    </button>

                    <button
                      type="button"
                      aria-label="Next image"
                      onClick={() =>
                        setActiveImage((previous) =>
                          (previous + 1) % images.length
                        )
                      }
                      className="absolute top-1/2 right-3 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-slate-900 shadow transition hover:bg-white"
                    >
                      <ChevronRight className="size-5" />
                    </button>
                  </>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {images.map((image, index) => (
                  <button
                    key={image + index}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`size-16 overflow-hidden rounded-lg border-2 transition sm:size-20 ${
                      activeImage === index
                        ? "border-brand"
                        : "border-transparent opacity-75 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${studio.title} photo ${index + 1}`}
                      className="size-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="flex aspect-[16/8] items-center justify-center rounded-2xl bg-muted">
              <ImageIcon className="size-12 text-muted-foreground" />
            </div>
          )}
        </section>

        {/* Main Content */}
        <div className="grid items-start gap-6 lg:grid-cols-[1fr_320px]">

          <div className="space-y-6">

            {/* Studio Information */}
            <Card className="rounded-2xl border-border bg-card shadow-sm">
              <CardContent className="grid grid-cols-2 gap-5 p-5 sm:grid-cols-3">

                <div>
                  <p className="text-[11px] text-muted-foreground">
                    Hourly Rate
                  </p>

                  <p className="mt-1 text-lg font-bold text-brand">
                    ${studio.hourlyRate}
                    <span className="text-xs font-normal text-muted-foreground">
                      /hr
                    </span>
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-muted-foreground">
                    Security Deposit
                  </p>

                  <p className="mt-1 text-lg font-bold text-card-foreground">
                    ${studio.securityDeposit}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-muted-foreground">
                    Max Capacity
                  </p>

                  <p className="mt-1 text-lg font-bold text-card-foreground">
                    {studio.capacity} people
                  </p>
                </div>

              </CardContent>
            </Card>

            {/* Overview */}
            <Card className="rounded-2xl border-border bg-card shadow-sm">
              <CardContent className="p-5">
                <h2 className="text-base font-bold text-card-foreground">
                  Workspace Overview
                </h2>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {studio.description}
                </p>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card className="rounded-2xl border-border bg-card shadow-sm">
              <CardContent className="p-5">
                <h2 className="text-base font-bold text-card-foreground">
                  Amenities & Equipment
                </h2>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {studio.amenities?.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-3 text-sm text-muted-foreground"
                    >
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
                        <CheckCircle2 className="size-4" />
                      </span>

                      {amenityLabels[amenity] || amenity}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="rounded-2xl border-border bg-card shadow-sm">
              <CardContent className="p-5">
                <h2 className="text-base font-bold text-card-foreground">
                  Location
                </h2>

                <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="size-4 text-brand" />
                  {studio.location}
                </p>
              </CardContent>
            </Card>

          </div>

          {/* Booking Sidebar */}
          <aside className="lg:sticky lg:top-24">
            <Card className="rounded-2xl border-border bg-card shadow-[0_8px_25px_rgba(30,20,70,0.12)]">
              <CardContent className="p-5">

                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <p className="text-2xl font-bold text-brand">
                      ${studio.hourlyRate}
                      <span className="text-xs font-normal text-muted-foreground">
                        {" "}/ hour
                      </span>
                    </p>
                  </div>
                </div>

                <div className="space-y-4 py-5">

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Security Deposit
                    </span>

                    <span className="font-semibold text-card-foreground">
                      ${studio.securityDeposit}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Cancellation Policy
                    </span>

                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      Host approval required
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Availability
                    </span>

                    <span className="font-medium text-card-foreground">
                      Request a slot
                    </span>
                  </div>

                </div>

                <Button
                  onClick={() => setBookingOpen(true)}
                  className="h-11 w-full rounded-xl bg-brand text-sm font-semibold text-white hover:bg-brand-strong"
                >
                  <CalendarDays className="mr-2 size-4" />
                  Book Workspace Now
                </Button>

                <p className="mt-4 text-center text-[11px] leading-5 text-muted-foreground">
                  You won't be charged immediately. Your reservation
                  will enter Pending status for host approval.
                </p>

                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
                  <ShieldCheck className="size-4" />
                  Secure booking experience
                </div>

              </CardContent>
            </Card>
          </aside>

        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border-border bg-card text-card-foreground sm:max-w-[480px]">

          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-card-foreground">
              Book Your Workspace
            </DialogTitle>
          </DialogHeader>

          {/* Selected Studio */}
          <div className="rounded-xl bg-brand-soft p-3">
            <p className="font-semibold text-foreground">
              {studio.title}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {studio.location}
            </p>
          </div>

          <form onSubmit={handleBookingSubmit} className="space-y-4">

            {/* Booking Date */}
            <div className="space-y-2">
              <Label htmlFor="booking-date">
                Booking Date
              </Label>

              <Input
                id="booking-date"
                type="date"
                min={new Date().toLocaleDateString("en-CA")}
                value={booking.date}
                onChange={(e) =>
                  setBooking({ ...booking, date: e.target.value })
                }
                className="border-border bg-background text-foreground"
                required
              />
            </div>

            {/* Booking Time */}
            <div className="grid grid-cols-2 gap-3">

              <div className="space-y-2">
                <Label htmlFor="start-time">
                  Start Time
                </Label>

                <Input
                  id="start-time"
                  type="time"
                  value={booking.startTime}
                  onChange={(e) =>
                    setBooking({ ...booking, startTime: e.target.value })
                  }
                  className="border-border bg-background text-foreground"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-time">
                  End Time
                </Label>

                <Input
                  id="end-time"
                  type="time"
                  value={booking.endTime}
                  onChange={(e) =>
                    setBooking({ ...booking, endTime: e.target.value })
                  }
                  className="border-border bg-background text-foreground"
                  required
                />
              </div>

            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="booking-message">
                Message to Host (Optional)
              </Label>

              <Textarea
                id="booking-message"
                placeholder="Tell the host about your project..."
                value={booking.message}
                onChange={(e) =>
                  setBooking({ ...booking, message: e.target.value })
                }
                rows={3}
                className="border-border bg-background text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Price Summary */}
            <div className="rounded-xl border border-border bg-muted p-4">

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  ${studio.hourlyRate} × {bookingHours} hours
                </span>

                <span className="font-semibold text-foreground">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              <div className="mt-3 flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Security Deposit
                </span>

                <span className="font-semibold text-foreground">
                  ${studio.securityDeposit}
                </span>
              </div>

              <div className="mt-3 flex justify-between border-t border-border pt-3">
                <span className="font-semibold text-foreground">
                  Estimated Total
                </span>

                <span className="text-lg font-bold text-brand">
                  ${(totalPrice + studio.securityDeposit).toFixed(2)}
                </span>
              </div>

            </div>

            {/* Submit Booking */}
            <Button
              type="submit"
              disabled={isBooking || bookingHours <= 0}
              className="h-11 w-full rounded-xl bg-brand text-white hover:bg-brand-strong"
            >
              {isBooking ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <CalendarDays className="mr-2 size-4" />
                  Continue Booking
                </>
              )}
            </Button>

          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}
