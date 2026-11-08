
"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
    Search,
    MapPin,
    Users,
    SlidersHorizontal,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Image as ImageIcon,
    Zap,
    AudioLines,
    Sun,
    CalendarDays,
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

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

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

    // Fetch studios from MongoDB through Express
    useEffect(() => {
        const fetchStudios = async () => {
            try {
                setIsLoading(true)
                setError("")

                const response = await fetch(`${API_URL}/studios`)

                if (!response.ok) {
                    throw new Error("Failed to load studios.")
                }

                const result = await response.json()

                console.log("Fetched Studios:", result)

                setStudios(Array.isArray(result) ? result : result.studios || [])
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "Something went wrong."
                )
            } finally {
                setIsLoading(false)
            }
        }

        fetchStudios()
    }, [])

    // Filter and sort studios
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

        // Category filter
        if (category !== "all") {
            result = result.filter(
                (studio) => studio.category === category
            )
        }

        // Price filter
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

        // Amenity filter
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
            // Newest first
            result.reverse()
        }

        return result
    }, [studios, search, category, price, sort, selectedAmenity])

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

    const toggleAmenity = (amenity: string) => {
        setSelectedAmenity((previous) =>
            previous === amenity ? "" : amenity
        )
    }

    return (
        <main className="min-h-screen bg-[#faf9ff]">
            <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">


                {/* Page Heading */}
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                        <Badge className="mb-3 rounded-full bg-violet-100 px-3 py-1 text-[10px] font-semibold tracking-wide text-violet-700 hover:bg-violet-100">
                            <span className="mr-1">●</span>
                            VERIFIED PRODUCTION SPACES
                        </Badge>

                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-[30px]">
                            Explore Creative Studios
                        </h1>

                        <p className="mt-1.5 max-w-xl text-sm leading-6 text-slate-600">
                            Find and book hourly creative spaces tailored to your
                            production needs — filter by craft, budget, and acoustic fidelity.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-600">Showing</span>

                        <Badge className="rounded-md bg-violet-100 px-2.5 py-1 font-semibold text-violet-700 hover:bg-violet-100">
                            {filteredStudios.length} Studios
                        </Badge>

                        <span className="text-slate-600">nationwide</span>
                    </div>
                </div>


                {/* Modern Filter Bar */}
                <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm">

                    {/* Main Filters */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-[1.8fr_1fr_0.7fr_0.7fr]">

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-500" />

                            <Input
                                placeholder="Search by studio name, keyword, or city..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-10 rounded-xl border-0 bg-[#f5f4fc] pl-10 text-xs shadow-none placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-violet-300"
                            />
                        </div>

                        {/* Category */}
                        <Select
                            value={category}
                            onValueChange={(value) => {
                                if (value !== null) setCategory(value);
                            }}
                        >
                            <SelectTrigger className="h-10 w-full rounded-xl border-0 bg-[#f5f4fc] px-3 text-xs shadow-none">
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
                                if (value !== null) setPrice(value);
                            }}
                        >
                            <SelectTrigger className="h-10 w-full rounded-xl border-0 bg-[#f5f4fc] px-3 text-xs shadow-none">
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
                                if (value !== null) setSort(value);
                            }}
                        >
                            <SelectTrigger className="h-10 w-full rounded-xl border-0 bg-[#f5f4fc] px-3 text-xs shadow-none">
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
                            onClick={() => setSelectedAmenity("")}
                            className={`h-7 rounded-full px-3 text-[10px] ${!selectedAmenity
                                ? "bg-violet-700 text-white hover:bg-violet-800"
                                : "bg-violet-50 text-slate-600 hover:bg-violet-100"
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
                                className={`h-7 rounded-full border-0 px-3 text-[10px] ${selectedAmenity === amenity
                                    ? "bg-violet-700 text-white hover:bg-violet-800"
                                    : "bg-violet-50 text-slate-600 hover:bg-violet-100"
                                    }`}
                            >
                                {amenityLabels[amenity]}
                            </Button>
                        ))}

                        {/* Reset Filters */}
                        {(search || category !== "all" || price !== "all" || selectedAmenity) && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("")
                                    setCategory("all")
                                    setPrice("all")
                                    setSort("recommended")
                                    setSelectedAmenity("")
                                }}
                                className="ml-auto flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:text-violet-700"
                            >
                                <RotateCcw className="size-3" />
                                Reset Filters
                            </button>
                        )}
                    </div>
                </div>


                {/* Results Heading */}
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        {filteredStudios.length} studios found
                    </p>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
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
                                className="overflow-hidden rounded-2xl border bg-white"
                            >
                                <div className="aspect-[4/3] animate-pulse bg-slate-200" />
                                <div className="space-y-3 p-4">
                                    <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                                    <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
                                    <div className="h-8 animate-pulse rounded bg-slate-200" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error */}
                {!isLoading && error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
                        <p className="font-semibold text-red-700">
                            {error}
                        </p>

                        <p className="mt-2 text-sm text-red-600">
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
                                className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >
                                {/* Image */}
                                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                                    {studio.images?.[0] ? (
                                        <img
                                            src={studio.images[0]}
                                            alt={studio.title}
                                            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="flex size-full items-center justify-center">
                                            <ImageIcon className="size-10 text-slate-300" />
                                        </div>
                                    )}

                                    <Badge className="absolute top-3 left-3 bg-white/95 text-slate-800 shadow-sm hover:bg-white">
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
                                        <h2 className="line-clamp-1 text-base font-bold text-slate-900">
                                            {studio.title}
                                        </h2>
                                    </div>

                                    <div className="mb-3 flex items-center gap-1.5 text-xs text-slate-500">
                                        <MapPin className="size-3.5 shrink-0" />
                                        <span className="line-clamp-1">
                                            {studio.location}
                                        </span>
                                    </div>

                                    <div className="mb-3 flex items-center gap-3 text-xs text-slate-500">
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
                                                className="rounded-full bg-slate-100 text-[10px] font-normal text-slate-600"
                                            >
                                                {amenityLabels[amenity] || amenity}
                                            </Badge>
                                        ))}

                                        {studio.amenities?.length > 3 && (
                                            <Badge
                                                variant="outline"
                                                className="rounded-full text-[10px]"
                                            >
                                                +{studio.amenities.length - 3}
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Price and Details */}
                                    <div className="flex items-center justify-between border-t pt-3">
                                        <div>
                                            <p className="text-lg font-bold text-violet-700">
                                                ${studio.hourlyRate}
                                                <span className="text-xs font-normal text-slate-500">
                                                    {" "}/ hr
                                                </span>
                                            </p>
                                        </div>

                                        <Button

                                            size="sm"
                                            className="rounded-full bg-violet-600 py-4 px-4  hover:bg-violet-700"
                                        >
                                            <Link href={`/studios/${studio._id}`}>
                                                View Details
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && filteredStudios.length === 0 && (
                    <div className="rounded-2xl border border-dashed bg-white px-6 py-20 text-center">
                        <Search className="mx-auto size-10 text-slate-300" />

                        <h3 className="mt-4 text-lg font-semibold text-slate-800">
                            No studios found
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Try changing your search or filters.
                        </p>

                        <Button
                            variant="outline"
                            className="mt-5"
                            onClick={() => {
                                setSearch("")
                                setCategory("all")
                                setPrice("all")
                                setSelectedAmenity("")
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}

                {/* Pagination */}
                {!isLoading && !error && totalPages > 1 && (
                    <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
                        <p className="text-xs text-slate-500">
                            Showing {startIndex + 1}–
                            {Math.min(startIndex + itemsPerPage, filteredStudios.length)}
                            {" "}of {filteredStudios.length} studios
                        </p>

                        <div className="flex items-center gap-2">
                            <Button
                                size="icon"
                                variant="outline"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((page) => page - 1)}
                            >
                                <ChevronLeft className="size-4" />
                            </Button>

                            {Array.from({ length: totalPages }).map((_, index) => (
                                <Button
                                    key={index}
                                    size="icon"
                                    variant={
                                        currentPage === index + 1
                                            ? "default"
                                            : "outline"
                                    }
                                    onClick={() => setCurrentPage(index + 1)}
                                    className={
                                        currentPage === index + 1
                                            ? "bg-violet-600 hover:bg-violet-700"
                                            : ""
                                    }
                                >
                                    {index + 1}
                                </Button>
                            ))}

                            <Button
                                size="icon"
                                variant="outline"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((page) => page + 1)}
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
