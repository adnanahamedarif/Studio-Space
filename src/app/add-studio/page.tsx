
"use client"

import { useState, type FormEvent, type ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import toast from "react-hot-toast"
import { authClient } from "@/lib/auth-client"
import {
  Banknote,
  CheckCircle2,
  ClipboardList,
  FileText,
  ImagePlus,
  MapPin,
  SlidersHorizontal,
} from "lucide-react"

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

// Amenities
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

const initialForm: StudioForm = {
  title: "",
  category: "",
  location: "",
  hourlyRate: "",
  securityDeposit: "",
  capacity: "",
  images: [],
  amenities: [
    "lighting-kit",
    "cyclorama-wall",
    "high-speed-wifi",
    "sound-insulation",
    "diffusers",
    "loading-bay",
  ],
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
            <CardTitle
              role="heading"
              aria-level={2}
              className="text-base font-semibold text-ink"
            >
              {title}
            </CardTitle>

            <CardDescription className="mt-1 text-[13px] leading-5 text-slate-500">
              {description}
            </CardDescription>
          </div>
        </div>

        {action}
      </div>
    </CardHeader>
  )
}

export default function AddStudioPage() {
const { data: session, isPending } = authClient.useSession()
  const [form, setForm] = useState<StudioForm>(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const update = <K extends keyof StudioForm>(
    field: K,
    value: StudioForm[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAmenityChange = (
    id: string,
    checked: boolean
  ) => {
    if (checked) {
      update("amenities", [...form.amenities, id])
    } else {
      update(
        "amenities",
        form.amenities.filter((item) => item !== id)
      )
    }
  }

  // Calculate Payout
  const hourlyRate = Number(form.hourlyRate) || 0
  const estimatedPayout = hourlyRate * 0.85

  // Submit Form
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()


    const ownerEmail = session?.user?.email

    if (!ownerEmail) {
      toast.error("Please login before adding a studio.")
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

    if (
      !Number.isFinite(Number(form.hourlyRate)) ||
      Number(form.hourlyRate) <= 0
    ) {
      toast.error("Please enter a valid hourly rate.")
      return
    }

    if (
      !Number.isInteger(Number(form.capacity)) ||
      Number(form.capacity) <= 0
    ) {
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

      const apiUrl = process.env.NEXT_PUBLIC_API_URL

      const response = await fetch(`${apiUrl}/add-studio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ...studioData,
          ownerEmail: ownerEmail,
        }),
      })

      const result = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(
          result?.message || "Failed to create studio."
        )
      }

      toast.success("Studio added successfully!")

      setForm(initialForm)

      // Redirect after successful submission
      window.location.href = "/my-listings"
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong."

      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen flex-1 bg-surface">
      <div className="mx-auto w-full max-w-[1380px] px-6 pt-7 pb-16 sm:px-8 lg:pb-20">

        {/* Page Heading */}
        <div className="flex flex-wrap items-center gap-3">
          <h1
            id="page-title"
            className="text-[30px] font-bold tracking-[-0.04em] text-ink sm:text-[36px]"
          >
            List Your Studio
          </h1>

          <Badge
            variant="outline"
            className="h-5 border-brand/20 bg-brand-soft/60 px-2.5 text-[9px] font-semibold tracking-[0.14em] text-brand uppercase"
          >
            Host Portal
          </Badge>
        </div>

        <p className="mt-2 max-w-[560px] text-sm leading-6 text-slate-500">
          Publish your creative space to thousands of verified photographers,
          podcasters, and filmmakers in minutes.
        </p>

        {/* Main Form */}
        <form
          aria-labelledby="page-title"
          onSubmit={handleSubmit}
          className="mx-auto mt-8 w-full max-w-[880px] space-y-6"
        >

          <Card className="gap-5 rounded-2xl py-7 shadow-[0_1px_2px_rgba(17,18,43,0.04)] ring-slate-200/80">
            <StudioCardHeader
              icon={ClipboardList}
              title="Studio Essentials"
              description="Core details creators see in search results"
            />

            <CardContent className="space-y-4 px-7">

              <div className="space-y-2">
                <Label htmlFor="studio-title">
                  Studio Title <span className="text-brand">*</span>
                </Label>

                <Input
                  id="studio-title"
                  placeholder="Enter your studio title"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  maxLength={70}
                  required
                  className="h-10 bg-white text-sm"
                />

                <p className="text-right text-[11px] text-slate-400">
                  {form.title.length}/70
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="space-y-2">
                  <Label>
                    Space Category <span className="text-brand">*</span>
                  </Label>

                  <Select
                    value={form.category}
                    onValueChange={(value) => {
                      if (value !== null) update("category", value)
                    }}
                  >
                    <SelectTrigger className="h-10 w-full bg-white text-sm">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="Photo Studio">
                        Photo Studio
                      </SelectItem>

                      <SelectItem value="Film Stage">
                        Film Stage
                      </SelectItem>

                      <SelectItem value="Podcast Lounge">
                        Podcast Lounge
                      </SelectItem>

                      <SelectItem value="Music Suite">
                        Music Suite
                      </SelectItem>

                      <SelectItem value="Workshop">
                        Workshop
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="studio-address">
                    Address & Neighborhood{" "}
                    <span className="text-brand">*</span>
                  </Label>

                  <div className="relative">
                    <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />

                    <Input
                      id="studio-address"
                      placeholder="Enter studio address"
                      value={form.location}
                      onChange={(e) => update("location", e.target.value)}
                      required
                      className="h-10 bg-white pl-9 text-sm"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Capacity */}
          <Card className="gap-5 rounded-2xl py-7 shadow-[0_1px_2px_rgba(17,18,43,0.04)] ring-slate-200/80">
            <StudioCardHeader
              icon={Banknote}
              title="Pricing & Capacity"
              description="Define your hourly rate and guest limits."
            />

            <CardContent className="space-y-5 px-7">
              <div className="grid gap-4 sm:grid-cols-3">

                {/* Hourly Rate */}
                <div className="space-y-2">
                  <Label htmlFor="hourly-rate">
                    Hourly Rate ($/hr) <span className="text-brand">*</span>
                  </Label>

                  <div className="relative">
                    <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-500">
                      $
                    </span>

                    <Input
                      id="hourly-rate"
                      type="number"
                      min="1"
                      placeholder="85"
                      value={form.hourlyRate}
                      onChange={(e) => update("hourlyRate", e.target.value)}
                      required
                      className="h-10 bg-white pl-7 text-sm"
                    />
                  </div>
                </div>

                {/* Security Deposit */}
                <div className="space-y-2">
                  <Label htmlFor="security-deposit">
                    Security Deposit ($)
                  </Label>

                  <div className="relative">
                    <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-500">
                      $
                    </span>

                    <Input
                      id="security-deposit"
                      type="number"
                      min="0"
                      placeholder="200"
                      value={form.securityDeposit}
                      onChange={(e) =>
                        update("securityDeposit", e.target.value)
                      }
                      className="h-10 bg-white pl-7 text-sm"
                    />
                  </div>
                </div>

                {/* Capacity */}
                <div className="space-y-2">
                  <Label htmlFor="max-capacity">
                    Max Capacity <span className="text-brand">*</span>
                  </Label>

                  <Input
                    id="max-capacity"
                    type="number"
                    min="1"
                    placeholder="18"
                    value={form.capacity}
                    onChange={(e) => update("capacity", e.target.value)}
                    required
                    className="h-10 bg-white text-sm"
                  />
                </div>
              </div>

              {/* Estimated Payout */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
                <p className="text-[11px] text-slate-500">
                  Estimated Hour Payout{" "}
                  <span className="text-slate-400">
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
          <Card className="gap-5 rounded-2xl py-7 shadow-[0_1px_2px_rgba(17,18,43,0.04)] ring-slate-200/80">
            <StudioCardHeader
              icon={ImagePlus}
              title="Studio Photos"
              description="Add studio images using image URLs."
              action={
                <Badge
                  variant="secondary"
                  className="shrink-0"
                >
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
          <Card className="gap-5 rounded-2xl py-7 shadow-[0_1px_2px_rgba(17,18,43,0.04)] ring-slate-200/80">
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
                      className="border-slate-300 data-checked:border-brand data-checked:bg-brand data-checked:text-white"
                    />

                    <Label
                      htmlFor={id}
                      className="cursor-pointer text-xs font-normal text-slate-600"
                    >
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="gap-5 rounded-2xl py-7 shadow-[0_1px_2px_rgba(17,18,43,0.04)] ring-slate-200/80">
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
                className="min-h-[130px] resize-none bg-white text-sm leading-6"
              />

              <p className="mt-2 text-right text-[11px] text-slate-400">
                {form.description.length}/2000
              </p>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => {
                  setForm(initialForm)
                  toast.success("Form cleared.")
                }}
                className="text-sm font-medium text-ink transition-colors hover:text-brand"
              >
                Clear Form
              </button>

              <button
                type="button"
                onClick={() => window.history.back()}
                className="text-sm text-slate-500 transition-colors hover:text-ink"
              >
                Cancel
              </button>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-full bg-brand px-6 text-sm font-semibold text-white shadow-[0_12px_24px_-14px_rgba(98,56,245,0.9)] hover:bg-brand-strong sm:w-auto"
            >
              <CheckCircle2 className="size-4" />

              {isSubmitting
                ? "Submitting..."
                : "Save & Submit for Review"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
