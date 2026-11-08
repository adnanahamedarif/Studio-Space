import type { Metadata } from "next"
import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  ClipboardList,
  Eye,
  FileText,
  ImagePlus,
  MapPin,
  MoreHorizontal,
  SlidersHorizontal,
  UploadCloud,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
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

export const metadata: Metadata = {
  title: "List Your Studio — StudioSpace",
  description:
    "Publish your creative space to thousands of verified photographers, podcasters, and filmmakers.",
}

const amenities = [
  { id: "lighting-kit", label: "Lighting Kit", checked: true },
  { id: "cyclorama-wall", label: "Cyclorama Wall", checked: true },
  { id: "high-speed-wifi", label: "High-Speed Wi-Fi", checked: true },
  { id: "sound-insulation", label: "Sound Insulation", checked: true },
  { id: "diffusers", label: "Diffusers", checked: true },
  { id: "loading-bay", label: "Loading Bay", checked: true },
  { id: "ac-heating", label: "A/C + Heating", checked: false },
  { id: "parking", label: "Parking", checked: false },
]

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
  return (
    <main className="min-h-screen flex-1 bg-surface">
      <div className="border-b border-slate-200/70">
        <div className="mx-auto flex w-full max-w-[1380px] items-center px-6 py-3 sm:px-8">
          <Breadcrumb>
            <BreadcrumbList className="items-center gap-1.5 text-[12px] text-slate-500">
              <BreadcrumbItem>
                <BreadcrumbLink
                  render={<Link href="/" />}
                  className="inline-flex items-center gap-1.5 text-slate-600 hover:text-brand"
                >
                  <ArrowLeft className="size-3.5" />
                  Host dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-slate-300">
                /
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink
                  render={<Link href="#" />}
                  className="text-slate-600 hover:text-brand"
                >
                  Listings
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-slate-300">
                /
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-slate-700">
                  Add Studio
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1380px] px-6 pt-7 pb-16 sm:px-8 lg:pb-20">
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

        <form
          aria-labelledby="page-title"
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
                <div className="flex items-center justify-between gap-4">
                  <Label
                    htmlFor="studio-title"
                    className="text-xs font-medium text-slate-600"
                  >
                    Studio Title <span className="text-brand">*</span>
                  </Label>
                  <span className="text-[11px] text-slate-400">0/70</span>
                </div>
                <Input
                  id="studio-title"
                  defaultValue="Arts District North Daylight Loft & Sound Stage"
                  maxLength={70}
                  className="h-10 bg-white text-sm"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="space-category"
                    className="text-xs font-medium text-slate-600"
                  >
                    Space Category <span className="text-brand">*</span>
                  </Label>
                  <Select defaultValue="Photo Studio">
                    <SelectTrigger
                      id="space-category"
                      className="h-10 w-full bg-white text-sm"
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Photo Studio">
                        Photo Studio
                      </SelectItem>
                      <SelectItem value="Sound Stage">Sound Stage</SelectItem>
                      <SelectItem value="Podcast Room">
                        Podcast Room
                      </SelectItem>
                      <SelectItem value="Music Suite">Music Suite</SelectItem>
                      <SelectItem value="Art Workshop">
                        Art Workshop
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="studio-address"
                    className="text-xs font-medium text-slate-600"
                  >
                    Address &amp; Neighborhood{" "}
                    <span className="text-brand">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="studio-address"
                      defaultValue="1240 E 6th St, Arts District, Los Angeles"
                      className="h-10 bg-white pl-9 text-sm"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="gap-5 rounded-2xl py-7 shadow-[0_1px_2px_rgba(17,18,43,0.04)] ring-slate-200/80">
            <StudioCardHeader
              icon={Banknote}
              title="Pricing & Capacity"
              description="Define your hourly rate and guest limits."
            />
            <CardContent className="space-y-5 px-7">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label
                    htmlFor="hourly-rate"
                    className="text-xs font-medium text-slate-600"
                  >
                    Hourly Rate ($/hr) <span className="text-brand">*</span>
                  </Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-500">
                      $
                    </span>
                    <Input
                      id="hourly-rate"
                      defaultValue="85"
                      inputMode="decimal"
                      className="h-10 bg-white pl-7 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="security-deposit"
                    className="text-xs font-medium text-slate-600"
                  >
                    Security Deposit ($)
                  </Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-500">
                      $
                    </span>
                    <Input
                      id="security-deposit"
                      defaultValue="200"
                      inputMode="decimal"
                      className="h-10 bg-white pl-7 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="max-capacity"
                    className="text-xs font-medium text-slate-600"
                  >
                    Max Capacity <span className="text-brand">*</span>
                  </Label>
                  <Input
                    id="max-capacity"
                    defaultValue="18"
                    inputMode="numeric"
                    className="h-10 bg-white text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
                <p className="text-[11px] text-slate-500">
                  Estimated Hour Payout{" "}
                  <span className="text-slate-400">
                    (after 15% platform fee)
                  </span>
                </p>
                <p className="text-xs font-semibold text-brand">$68.75 / hr</p>
              </div>
            </CardContent>
          </Card>

          <Card className="gap-5 rounded-2xl py-7 shadow-[0_1px_2px_rgba(17,18,43,0.04)] ring-slate-200/80">
            <StudioCardHeader
              icon={ImagePlus}
              title="Studio Photos"
              description="Showcase your daylight and equipment."
              action={
                <Badge
                  variant="secondary"
                  className="h-5 shrink-0 bg-brand-soft px-2 text-[9px] font-semibold tracking-[0.08em] text-brand uppercase"
                >
                  1/10 Uploaded
                </Badge>
              }
            />
            <CardContent className="space-y-3 px-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex aspect-[4/3] min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/80 px-6 py-8 text-center transition-colors hover:border-brand/40 hover:bg-brand-soft/30">
                  <span className="grid size-9 place-items-center rounded-full bg-white text-slate-500 shadow-sm">
                    <UploadCloud className="size-4" />
                  </span>
                  <span className="mt-3 text-sm font-medium text-slate-700">
                    Drag &amp; drop photos
                  </span>
                  <span className="mt-1 text-[11px] text-slate-500">
                    PNG, JPG, or WEBP up to 10MB
                  </span>
                  <span className="mt-3 text-xs font-semibold text-brand">
                    Browse files
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/webp"
                    className="sr-only"
                  />
                </label>

                <div className="relative aspect-[4/3] min-h-[200px] overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src="/images/banner.jpg"
                    alt="Preview of The Loft Daylight Studio"
                    fill
                    sizes="(min-width: 640px) 420px, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent p-3">
                    <p className="text-[11px] font-medium text-white">
                      The Loft Daylight Studio
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Photo options"
                    className="absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-black/35 text-white backdrop-blur transition-colors hover:bg-black/50"
                  >
                    <MoreHorizontal className="size-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <a
                  href="https://images.unsplash.com/photo-1598928506311-c55ded91a20c"
                  className="min-w-0 flex-1 truncate text-[11px] text-slate-500 hover:text-brand"
                >
                  https://images.unsplash.com/photo-1598928506311-c55ded91a20c
                </a>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 shrink-0 rounded-lg border-brand/20 px-3 text-[11px] font-semibold text-brand hover:bg-brand-soft hover:text-brand"
                >
                  <Eye className="size-3.5" />
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="gap-5 rounded-2xl py-7 shadow-[0_1px_2px_rgba(17,18,43,0.04)] ring-slate-200/80">
            <StudioCardHeader
              icon={SlidersHorizontal}
              title="Amenities & Gear"
              description="Select key equipment included with booking."
              action={
                <span className="shrink-0 pt-1 text-[10px] font-semibold tracking-[0.12em] text-brand uppercase">
                  6 Selected
                </span>
              }
            />
            <CardContent className="px-7">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
                {amenities.map(({ id, label, checked }) => (
                  <div key={id} className="flex items-center gap-2">
                    <Checkbox
                      id={id}
                      defaultChecked={checked}
                      className="border-slate-300 data-checked:border-brand data-checked:bg-brand data-checked:text-white"
                    />
                    <Label
                      htmlFor={id}
                      className="text-xs font-normal text-slate-600"
                    >
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="gap-5 rounded-2xl py-7 shadow-[0_1px_2px_rgba(17,18,43,0.04)] ring-slate-200/80">
            <StudioCardHeader
              icon={FileText}
              title="Studio Description"
              description="Describe your space in detail."
            />
            <CardContent className="px-7">
              <Textarea
                id="studio-description"
                defaultValue="A pristine 2,400 sq. ft. commercial production studio featuring a 24'x20' full cove seamless daylight with motorized blackout shades for full lighting control. Acoustically treated STC-50 partitions make this space optimal for photo, video, and audio production."
                className="min-h-[130px] resize-none bg-white text-sm leading-6"
              />
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <button
                type="button"
                className="text-sm font-medium text-ink transition-colors hover:text-brand"
              >
                Save Draft
              </button>
              <button
                type="button"
                className="text-sm text-slate-500 transition-colors hover:text-ink"
              >
                Cancel
              </button>
            </div>
            <Button
              type="button"
              className="h-11 w-full rounded-full bg-brand px-6 text-sm font-semibold text-white shadow-[0_12px_24px_-14px_rgba(98,56,245,0.9)] hover:bg-brand-strong sm:w-auto"
            >
              <CheckCircle2 className="size-4" />
              Save &amp; Submit for Review
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
