
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  MapPin,
  Loader2,
  ImageIcon,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type Studio = {
  _id: string
  title: string
  category: string
  location: string
  hourlyRate: number
  images: string[]
  capacity: number
  amenities: string[]
  rating?: number
  reviews?: number
}

const amenityLabels: Record<string, string> = {
  wifi: "Wi‑Fi",
  "wifi-internet": "Wi‑Fi",
  parking: "Parking",
  "natural-light": "Natural Light",
  "air-conditioning": "Air Conditioning",
  ac: "Air Conditioning",
  projector: "Projector",
  whiteboard: "Whiteboard",
  "conference-room": "Conference Room",
  kitchen: "Kitchen",
  lounge: "Lounge",
  receptionist: "Reception",
  showers: "Showers",
  storage: "Storage",
  soundproofing: "Soundproofing",
  "video-recording": "Video Recording",
  coffee: "Coffee",
  "24-7": "24/7 Access",
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export default function FeaturedStudios() {
  const [studios, setStudios] = useState<Studio[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`${API_URL}/studios`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch studios")
        }

        return response.json()
      })
      .then((result) => {
        const studioData = Array.isArray(result)
          ? result
          : result.studios || []

        setStudios(studioData.slice(0, 6))
      })
      .catch((error) => {
        console.log("Featured studios error:", error)
        setError("Unable to load studios.")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <section className="bg-background py-12 transition-colors duration-300 sm:py-16">
      <div className="mx-auto max-w-[1380px] px-6 sm:px-8">

        {/* Section Heading */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand">
              Curated Spaces
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Featured Studios Near You
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Discover creative spaces for your next project.
            </p>
          </div>

          <Link
            href="/studios"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition hover:text-brand-strong"
          >
            View all listings
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex min-h-52 items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-5 animate-spin text-brand" />
              Loading studios...
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-red-500">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && studios.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <h3 className="font-semibold text-foreground">
              No studios available yet
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              New creative spaces will appear here.
            </p>
          </div>
        )}

        {/* Studio Cards */}
        {!isLoading && !error && studios.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <div
                key={studio._id}
                className="group overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
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

                  <Badge className="absolute top-3 left-3 border-0 bg-background/95 text-foreground shadow-sm">
                    {studio.category}
                  </Badge>

                  {studio.images?.length > 1 && (
                    <Badge className="absolute right-3 bottom-3 border-0 bg-black/60 text-white hover:bg-black/60">
                      {studio.images.length} Photos
                    </Badge>
                  )}
                </div>

                {/* Studio Information */}
                <div className="p-4">
                  <h2 className="mb-2 line-clamp-1 text-base font-bold text-card-foreground">
                    {studio.title}
                  </h2>

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
                    <p className="text-lg font-bold text-brand">
                      ${studio.hourlyRate}
                      <span className="text-xs font-normal text-muted-foreground">
                        {" "}/ hr
                      </span>
                    </p>

                    <Button
                      nativeButton={false}
                      render={<Link href={`/studios/${studio._id}`} />}
                      className="cursor-pointer rounded-full bg-brand px-4 py-2 text-white hover:bg-brand-strong"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
