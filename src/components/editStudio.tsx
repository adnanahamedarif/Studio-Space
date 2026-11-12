
"use client"

import { useEffect, useState, type FormEvent, type ReactNode } from "react"
import { useParams, useRouter } from "next/navigation"
import toast from "react-hot-toast"
import type { LucideIcon } from "lucide-react"
import {
  Banknote,
  CheckCircle2,
  ClipboardList,
  FileText,
  ImagePlus,
  MapPin,
  SlidersHorizontal,
  Loader2,
} from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { ImageUrlUpload } from "@/components/image-upload"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getTokenFromClient } from "@/lib/getTokenFromClient"

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const amenities = [
  { id: "lighting-kit", label: "Lighting Kit" },
  { id: "cyclorama-wall", label: "Cyclorama Wall" },
  { id: "high-speed-wifi", label: "High-Speed Wi-Fi" },
  { id: "sound-insulation", label: "Sound Insulation" },
  { id: "diffusers", label: "Diffusers" },
  { id: "loading-bay", label: "Loading Bay" },
  { id: "ac-heating", label: "A/C + Heating" },
  { id: "parking", label: "Parking" },
]

type StudioForm = {
  title: string
  category: string
  location: string
  hourlyRate: string
  securityDeposit: string
  capacity: string
  images: string[]
  amenities: string[]
  description: string
}

type Studio = StudioForm & {
  _id: string
  ownerEmail: string
}

const initialForm: StudioForm = {
  title: "",
  category: "",
  location: "",
  hourlyRate: "",
  securityDeposit: "",
  capacity: "",
  images: [],
  amenities: [],
  description: "",
}

type StudioCardHeaderProps = {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}

function StudioCardHeader({
  icon: Icon,
  title,
  description,
  action,
}: StudioCardHeaderProps) {
  return (
    <CardHeader className="px-7">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
            <Icon className="size-5" strokeWidth={1.8} />
          </span>

          <div className="min-w-0">
            <CardTitle className="text-base font-semibold text-card-foreground">
              {title}
            </CardTitle>

            <CardDescription className="mt-1 text-[13px] leading-5 text-muted-foreground">
              {description}
            </CardDescription>
          </div>
        </div>

        {action}
      </div>
    </CardHeader>
  )
}

export default function EditStudio() {
  const params = useParams()
  const router = useRouter()
  const studioId = Array.isArray(params.id) ? params.id[0] : params.id

  const { data: session, isPending } = authClient.useSession()
  const userEmail = session?.user?.email

  const [form, setForm] = useState<StudioForm>(initialForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const update = <K extends keyof StudioForm>(
    field: K,
    value: StudioForm[K]
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  useEffect(() => {
    if (isPending) return

    if (!userEmail) {
      setIsLoading(false)
      return
    }

    if (!studioId) {
      setIsLoading(false)
      toast.error("Studio ID is missing.")
      return
    }

    let isActive = true

    const loadStudio = async () => {
      try {
        setIsLoading(true)

        const token = await getTokenFromClient()

        const response = await fetch(`${API_URL}/studios/${studioId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const result = await response.json().catch(() => null)

        if (!response.ok) {
          throw new Error(result?.message || "Failed to load studio.")
        }

        const studio: Studio | undefined =
          result?.studio || result?.result || result

        if (!studio) {
          throw new Error("Studio not found.")
        }

        if (!isActive) return

        setForm({
          title: studio.title || "",
          category: studio.category || "",
          location: studio.location || "",
          hourlyRate: String(studio.hourlyRate ?? ""),
          securityDeposit: String(studio.securityDeposit ?? ""),
          capacity: String(studio.capacity ?? ""),
          images: studio.images || [],
          amenities: studio.amenities || [],
          description: studio.description || "",
        })
      } catch (error) {
        if (!isActive) return

        toast.error(
          error instanceof Error ? error.message : "Unable to load studio."
        )
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    loadStudio()

    return () => {
      isActive = false
    }
  }, [studioId, userEmail, isPending])

  const handleAmenityChange = (id: string, checked: boolean) => {
    if (checked) {
      update("amenities", [...form.amenities, id])
    } else {
      update(
        "amenities",
        form.amenities.filter((item) => item !== id)
      )
    }
  }

  const hourlyRate = Number(form.hourlyRate) || 0
  const estimatedPayout = hourlyRate * 0.85

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!userEmail) {
      toast.error("Please login before editing a studio.")
      return
    }

    if (!form.category) {
      toast.error("Please select a studio category.")
      return
    }

    if (form.images.length === 0) {
      toast.error("Please add at least one studio image.")
      return
    }

    if (!Number.isFinite(Number(form.hourlyRate)) || Number(form.hourlyRate) <= 0) {
      toast.error("Please enter a valid hourly rate.")
      return
    }

    if (!Number.isInteger(Number(form.capacity)) || Number(form.capacity) <= 0) {
      toast.error("Please enter a valid studio capacity.")
      return
    }

    const studioData = {
      title: form.title.trim(),
      category: form.category,
      location: form.location.trim(),
      hourlyRate: Number(form.hourlyRate),
      securityDeposit: Number(form.securityDeposit) || 0,
      capacity: Number(form.capacity),
      images: form.images,
      amenities: form.amenities,
      description: form.description.trim(),
    }

    try {
      setIsSubmitting(true)

      const token = await getTokenFromClient()

      const response = await fetch(
        `${API_URL}/studios/${studioId}?email=${encodeURIComponent(userEmail)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(studioData),
        }
      )

      const result = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(result?.message || "Failed to update studio.")
      }

      toast.success(result?.message || "Studio updated successfully!")
      router.push("/my-listings")
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isPending || isLoading) {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-surface transition-colors">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-5 animate-spin text-brand" />
          Loading studio...
        </div>
      </main>
    )
  }

  if (!userEmail) {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-surface px-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">
            Login Required
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Please login to edit your studio listing.
          </p>

          <Button className="mt-5" onClick={() => router.push("/login")}>
            Login
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex-1 bg-surface transition-colors duration-300">
      <div className="mx-auto w-full max-w-[1380px] px-6 pt-7 pb-16 sm:px-8 lg:pb-20">

        {/* Page Header */}
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-[30px] font-bold tracking-[-0.04em] text-foreground sm:text-[36px]">
            Edit Studio
          </h1>

          <Badge
            variant="outline"
            className="h-5 border-brand/20 bg-brand-soft/60 px-2.5 text-[9px] font-semibold tracking-[0.14em] text-brand uppercase"
          >
            Host Portal
          </Badge>
        </div>

        <p className="mt-2 max-w-[560px] text-sm leading-6 text-muted-foreground">
          Update your studio information, pricing, photos and facilities.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 w-full max-w-[880px] space-y-6"
        >

          {/* Studio Essentials */}
          <Card className="gap-5 rounded-2xl border-border bg-card py-7 text-card-foreground shadow-sm">
            <StudioCardHeader
              icon={ClipboardList}
              title="Studio Essentials"
              description="Core details creators see in search results"
            />

            <CardContent className="space-y-4 px-7">
              <div className="space-y-2">
                <Label htmlFor="studio-title">Studio Title *</Label>

                <Input
                  id="studio-title"
                  placeholder="Enter your studio title"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  maxLength={70}
                  required
                  className="h-10 border-border bg-background text-sm"
                />

                <p className="text-right text-[11px] text-muted-foreground">
                  {form.title.length}/70
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Space Category *</Label>

                  <Select
                    value={form.category}
                    onValueChange={(value) => {
                      if (value !== null) update("category", value)
                    }}
                  >
                    <SelectTrigger className="h-10 w-full border-border bg-background text-sm">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="Photo Studio">Photo Studio</SelectItem>
                      <SelectItem value="Film Stage">Film Stage</SelectItem>
                      <SelectItem value="Podcast Lounge">Podcast Lounge</SelectItem>
                      <SelectItem value="Music Suite">Music Suite</SelectItem>
                      <SelectItem value="Workshop">Workshop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studio-address">
                    Address & Neighborhood *
                  </Label>

                  <div className="relative">
                    <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      id="studio-address"
                      placeholder="Enter studio address"
                      value={form.location}
                      onChange={(e) => update("location", e.target.value)}
                      required
                      className="h-10 border-border bg-background pl-9 text-sm"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Capacity */}
          <Card className="gap-5 rounded-2xl border-border bg-card py-7 text-card-foreground shadow-sm">
            <StudioCardHeader
              icon={Banknote}
              title="Pricing & Capacity"
              description="Define your hourly rate and guest limits."
            />

            <CardContent className="space-y-5 px-7">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="hourly-rate">Hourly Rate ($/hr) *</Label>

                  <div className="relative">
                    <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                      $
                    </span>

                    <Input
                      id="hourly-rate"
                      type="number"
                      min="1"
                      value={form.hourlyRate}
                      onChange={(e) => update("hourlyRate", e.target.value)}
                      required
                      className="h-10 border-border bg-background pl-7 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="security-deposit">
                    Security Deposit ($)
                  </Label>

                  <div className="relative">
                    <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                      $
                    </span>

                    <Input
                      id="security-deposit"
                      type="number"
                      min="0"
                      value={form.securityDeposit}
                      onChange={(e) => update("securityDeposit", e.target.value)}
                      className="h-10 border-border bg-background pl-7 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-capacity">Max Capacity *</Label>

                  <Input
                    id="max-capacity"
                    type="number"
                    min="1"
                    value={form.capacity}
                    onChange={(e) => update("capacity", e.target.value)}
                    required
                    className="h-10 border-border bg-background text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
                <p className="text-[11px] text-muted-foreground">
                  Estimated Hour Payout{" "}
                  <span className="text-muted-foreground">
                    (after 15% platform fee)
                  </span>
                </p>

                <p className="text-xs font-semibold text-brand">
                  ${estimatedPayout.toFixed(2)} / hr
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Studio Photos */}
          <Card className="gap-5 rounded-2xl border-border bg-card py-7 text-card-foreground shadow-sm">
            <StudioCardHeader
              icon={ImagePlus}
              title="Studio Photos"
              description="Add, remove or update studio image URLs."
              action={
                <Badge variant="secondary" className="shrink-0">
                  {form.images.length}/10 Added
                </Badge>
              }
            />

            <CardContent className="px-7">
              <ImageUrlUpload
                value={form.images}
                onChange={(images) => update("images", images)}
              />
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card className="gap-5 rounded-2xl border-border bg-card py-7 text-card-foreground shadow-sm">
            <StudioCardHeader
              icon={SlidersHorizontal}
              title="Amenities & Gear"
              description="Select key equipment included with booking."
              action={
                <span className="shrink-0 pt-1 text-[10px] font-semibold tracking-[0.12em] text-brand uppercase">
                  {form.amenities.length} Selected
                </span>
              }
            />

            <CardContent className="px-7">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
                {amenities.map(({ id, label }) => (
                  <div key={id} className="flex items-center gap-2">
                    <Checkbox
                      id={id}
                      checked={form.amenities.includes(id)}
                      onCheckedChange={(checked) =>
                        handleAmenityChange(id, checked === true)
                      }
                      className="border-border data-checked:border-brand data-checked:bg-brand data-checked:text-white"
                    />

                    <Label
                      htmlFor={id}
                      className="cursor-pointer text-xs font-normal text-foreground"
                    >
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="gap-5 rounded-2xl border-border bg-card py-7 text-card-foreground shadow-sm">
            <StudioCardHeader
              icon={FileText}
              title="Studio Description"
              description="Describe your space in detail."
            />

            <CardContent className="px-7">
              <Textarea
                id="studio-description"
                placeholder="Describe your studio, equipment, facilities and other details..."
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                required
                maxLength={2000}
                className="min-h-[130px] resize-none border-border bg-background text-sm leading-6"
              />

              <p className="mt-2 text-right text-[11px] text-muted-foreground">
                {form.description.length}/2000
              </p>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/my-listings")}
              className="h-11 rounded-full border-border px-6"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-full bg-brand px-6 text-sm font-semibold text-white hover:bg-brand-strong sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4" />
                  Update Studio
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
