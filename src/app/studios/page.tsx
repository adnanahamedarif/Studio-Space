
"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

import {
  Search,
  MapPin,
  Users,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  RotateCcw,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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

const amenityOptions = [
  "lighting-kit",
  "cyclorama-wall",
  "high-speed-wifi",
  "sound-insulation",
  "diffusers",
  "loading-bay",
  "ac-heating",
  "parking",
]

const amenityLabels: Record<string, string> = {
  "lighting-kit": "Lighting Kit",
  "cyclorama-wall": "Cyclorama Wall",
  "high-speed-wifi": "High-Speed Wi-Fi",
  "sound-insulation": "Sound Insulation",
  diffusers: "Diffusers",
  "loading-bay": "Loading Bay",
  "ac-heating": "A/C + Heating",
  parking: "Parking",
}

export default function ExploreStudiosPage() {
  const [studios, setStudios] = useState<Studio[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [price, setPrice] = useState("all")
  const [sort, setSort] = useState("recommended")
  const [selectedAmenity, setSelectedAmenity] = useState("")

  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 9

  // Fetch Studios from MongoDB
const fetchStudios = async () => {
  setIsLoading(true)
  setError("")

  const response = await fetch(`${API_URL}/studios`)
  const result = await response.json()

  setStudios(
    Array.isArray(result) ? result : result.studios || []
  )

  setIsLoading(false)
}

useEffect(() => {
  fetchStudios()
}, [])

  // Filter and Sort Studios
  const filteredStudios = useMemo(() => {
    let result = [...studios]

    // Search
    if (search.trim()) {
      const searchText = search.toLowerCase()

      result = result.filter((studio) =>
        [
          studio.title,
          studio.category,
          studio.location,
          studio.description,
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchText)
      )
    }

    // Category Filter
    if (category !== "all") {
      result = result.filter(
        (studio) => studio.category === category
      )
    }

    // Price Filter
    if (price === "under50") {
      result = result.filter(
        (studio) => studio.hourlyRate < 50
      )
    } else if (price === "50to100") {
      result = result.filter(
        (studio) =>
          studio.hourlyRate >= 50 &&
          studio.hourlyRate <= 100
      )
    } else if (price === "above100") {
      result = result.filter(
        (studio) => studio.hourlyRate > 100
      )
    }

    // Amenity Filter
    if (selectedAmenity) {
      result = result.filter((studio) =>
        studio.amenities?.includes(selectedAmenity)
      )
    }

    // Sorting
    if (sort === "price-low") {
      result.sort((a, b) => a.hourlyRate - b.hourlyRate)
    } else if (sort === "price-high") {
      result.sort((a, b) => b.hourlyRate - a.hourlyRate)
    } else if (sort === "name") {
      result.sort((a, b) => a.title.localeCompare(b.title))
    } else {
      result.reverse()
    }

    return result
  }, [studios, search, category, price, sort, selectedAmenity])

  // Pagination
  const totalPages = Math.ceil(
    filteredStudios.length / itemsPerPage
  )

  const effectivePage = Math.min(
    currentPage,
    Math.max(totalPages, 1)
  )

  const startIndex = (effectivePage - 1) * itemsPerPage

  const currentStudios = filteredStudios.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  // Toggle Amenity
  const toggleAmenity = (amenity: string) => {
    setSelectedAmenity((previous) =>
      previous === amenity ? "" : amenity
    )
    setCurrentPage(1)
  }

  // Reset Filters
  const resetFilters = () => {
    setSearch("")
    setCategory("all")
    setPrice("all")
    setSort("recommended")
    setSelectedAmenity("")
    setCurrentPage(1)
  }

  return (
    <main className="min-h-screen bg-background transition-colors duration-300">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">

        {/* Page Heading */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>
            <Badge className="mb-3 rounded-full bg-brand-soft px-3 py-1 text-[10px] font-semibold tracking-wide text-brand hover:bg-brand-soft">
              <span className="mr-1">●</span>
              VERIFIED PRODUCTION SPACES
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-[30px]">
              Explore Creative Studios
            </h1>

            <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted-foreground">
              Find and book hourly creative spaces tailored to your
              production needs — filter by craft, budget, and acoustic fidelity.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">
              Showing
            </span>

            <Badge className="rounded-md bg-brand-soft px-2.5 py-1 font-semibold text-brand hover:bg-brand-soft">
              {filteredStudios.length} Studios
            </Badge>

            <span className="text-muted-foreground">
              nationwide
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mb-6 rounded-2xl border border-border bg-card p-3.5 shadow-sm">

          {/* Main Filters */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_0.7fr_0.7fr]">

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                placeholder="Search by studio name, keyword, or city..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
                className="h-10 rounded-xl border-border bg-muted pl-10 text-xs text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-brand"
              />
            </div>

            {/* Category */}
            <Select
              value={category}
              onValueChange={(value) => {
                if (value !== null) {
                  setCategory(value)
                  setCurrentPage(1)
                }
              }}
            >
              <SelectTrigger className="h-10 w-full rounded-xl border-border bg-muted px-3 text-xs text-foreground shadow-none">
                <SelectValue>
                  {category === "all" ? "All Categories" : category}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Photo Studio">Photo Studio</SelectItem>
                <SelectItem value="Film Stage">Film Stage</SelectItem>
                <SelectItem value="Podcast Lounge">Podcast Lounge</SelectItem>
                <SelectItem value="Music Suite">Music Suite</SelectItem>
                <SelectItem value="Workshop">Workshop</SelectItem>
              </SelectContent>
            </Select>

            {/* Price */}
            <Select
              value={price}
              onValueChange={(value) => {
                if (value !== null) {
                  setPrice(value)
                  setCurrentPage(1)
                }
              }}
            >
              <SelectTrigger className="h-10 w-full rounded-xl border-border bg-muted px-3 text-xs text-foreground shadow-none">
                <SelectValue>
                  {price === "all"
                    ? "Any Price"
                    : price === "under50"
                      ? "Under $50/hr"
                      : price === "50to100"
                        ? "$50 - $100/hr"
                        : "Above $100/hr"}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Any Price</SelectItem>
                <SelectItem value="under50">Under $50/hr</SelectItem>
                <SelectItem value="50to100">$50 - $100/hr</SelectItem>
                <SelectItem value="above100">Above $100/hr</SelectItem>
              </SelectContent>
            </Select>

            {/* Sorting */}
            <Select
              value={sort}
              onValueChange={(value) => {
                if (value !== null) {
                  setSort(value)
                  setCurrentPage(1)
                }
              }}
            >
              <SelectTrigger className="h-10 w-full rounded-xl border-border bg-muted px-3 text-xs text-foreground shadow-none">
                <SelectValue>
                  {sort === "recommended"
                    ? "Recommended"
                    : sort === "price-low"
                      ? "Price: Low to High"
                      : sort === "price-high"
                        ? "Price: High to Low"
                        : "Name: A to Z"}
                </SelectValue>
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name: A to Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amenity Filters */}
          <div className="mt-4 flex flex-wrap items-center gap-1.5">

            {/* All Amenities */}
            <Button
              type="button"
              size="sm"
              onClick={() => {
                setSelectedAmenity("")
                setCurrentPage(1)
              }}
              className={`h-7 rounded-full px-3 text-[10px] ${
                !selectedAmenity
                  ? "bg-brand text-white hover:bg-brand-strong"
                  : "bg-brand-soft text-brand hover:bg-brand/15"
              }`}
            >
              All Amenities
            </Button>

            {amenityOptions.map((amenity) => (
              <Button
                key={amenity}
                type="button"
                size="sm"
                variant="outline"
                onClick={() => toggleAmenity(amenity)}
                className={`h-7 rounded-full border px-3 text-[10px] ${
                  selectedAmenity === amenity
                    ? "border-brand bg-brand text-white hover:bg-brand-strong"
                    : "border-border bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {amenityLabels[amenity]}
              </Button>
            ))}

            {/* Reset Filters */}
            {(search ||
              category !== "all" ||
              price !== "all" ||
              selectedAmenity ||
              sort !== "recommended") && (
              <button
                type="button"
                onClick={resetFilters}
                className="ml-auto flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-brand"
              >
                <RotateCcw className="size-3" />
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Heading */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredStudios.length} studios found
          </p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ArrowUpDown className="size-3.5" />
            <span>Sort and filter results</span>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="aspect-[4/3] animate-pulse bg-muted" />

                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                  <div className="h-8 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/30">
            <p className="font-semibold text-red-700 dark:text-red-400">
              {error}
            </p>

            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              Please check whether your backend server is running.
            </p>

            <Button
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Studio Cards */}
        {!isLoading && !error && currentStudios.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {currentStudios.map((studio) => (
              <div
                key={studio._id}
                className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {studio.images?.[0] ? (
                    <img
                      src={studio.images[0]}
                      alt={studio.title}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <ImageIcon className="size-10 text-muted-foreground" />
                    </div>
                  )}

                  <Badge className="absolute top-3 left-3 bg-background/95 text-foreground shadow-sm hover:bg-background">
                    {studio.category}
                  </Badge>

                  {studio.images?.length > 1 && (
                    <Badge className="absolute right-3 bottom-3 bg-black/60 text-white hover:bg-black/60">
                      {studio.images.length} Photos
                    </Badge>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">

                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h2 className="line-clamp-1 text-base font-bold text-card-foreground">
                      {studio.title}
                    </h2>
                  </div>

                  <div className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0" />

                    <span className="line-clamp-1">
                      {studio.location}
                    </span>
                  </div>

                  <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="size-3.5" />
                      Up to {studio.capacity} people
                    </span>
                  </div>

                  {/* Amenities */}
                  <div className="mb-4 flex min-h-7 flex-wrap gap-1.5">
                    {studio.amenities?.slice(0, 3).map((amenity) => (
                      <Badge
                        key={amenity}
                        variant="secondary"
                        className="rounded-full bg-secondary text-[10px] font-normal text-secondary-foreground"
                      >
                        {amenityLabels[amenity] || amenity}
                      </Badge>
                    ))}

                    {studio.amenities?.length > 3 && (
                      <Badge
                        variant="outline"
                        className="rounded-full border-border text-[10px] text-muted-foreground"
                      >
                        +{studio.amenities.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Price and Details */}
                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <div>
                      <p className="text-lg font-bold text-brand">
                        ${studio.hourlyRate}

                        <span className="text-xs font-normal text-muted-foreground">
                          {" "}/ hr
                        </span>
                      </p>
                    </div>

                    <Button
                      nativeButton={false}
                      render={<Link href={`/studios/${studio._id}`} />}
                      className="cursor-pointer rounded-full bg-brand px-4 py-5 text-white hover:bg-brand-strong"
                    >
                      View Details
                    </Button>
                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredStudios.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-20 text-center">
            <Search className="mx-auto size-10 text-muted-foreground" />

            <h3 className="mt-4 text-lg font-semibold text-card-foreground">
              No studios found
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Try changing your search or filters.
            </p>

            <Button
              variant="outline"
              className="mt-5 border-border"
              onClick={resetFilters}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && totalPages > 1 && (
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4">

            <p className="text-xs text-muted-foreground">
              Showing {startIndex + 1}–
              {Math.min(startIndex + itemsPerPage, filteredStudios.length)}
              {" "}of {filteredStudios.length} studios
            </p>

            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                disabled={effectivePage === 1}
                onClick={() =>
                  setCurrentPage((page) => page - 1)
                }
              >
                <ChevronLeft className="size-4" />
              </Button>

              {Array.from({ length: totalPages }).map((_, index) => (
                <Button
                  key={index}
                  size="icon"
                  variant={
                    effectivePage === index + 1
                      ? "default"
                      : "outline"
                  }
                  onClick={() => setCurrentPage(index + 1)}
                  className={
                    effectivePage === index + 1
                      ? "bg-brand text-white hover:bg-brand-strong"
                      : "border-border"
                  }
                >
                  {index + 1}
                </Button>
              ))}

              <Button
                size="icon"
                variant="outline"
                disabled={effectivePage === totalPages}
                onClick={() =>
                  setCurrentPage((page) => page + 1)
                }
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>

          </div>
        )}

      </div>
    </main>
  )
}
