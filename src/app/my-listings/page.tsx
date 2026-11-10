
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import toast from "react-hot-toast"

//import { authClient } from "@/lib/auth-client"

import {
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Users,
  Image as ImageIcon,
  Loader2,
  Building2,
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

export default function MyListingsPage() {
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession()

  const userEmail = session?.user?.email

  const [studios, setStudios] = useState<Studio[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch user's studio listings
  useEffect(() => {
    if (isSessionLoading) return

    if (!userEmail) {
      setStudios([])
      setIsLoading(false)
      return
    }

    fetch(`${API_URL}/my-listings?email=${encodeURIComponent(userEmail)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load studio listings")
        }

        return response.json()
      })
      .then((result) => {
        console.log("My Studio Listings:", result.studios)
        setStudios(result.studios || [])
      })
      .catch((error) => {
        console.log(error)
        setError("Unable to load your studio listings")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [userEmail, isSessionLoading])

  // Delete studio
  const handleDelete = () => {
    if (!deleteId || !userEmail) return

    setIsDeleting(true)

    fetch(
      `${API_URL}/my-listings/${deleteId}?email=${encodeURIComponent(userEmail)}`,
      {
        method: "DELETE",
      }
    )
      .then(async (response) => {
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || "Failed to delete studio")
        }

        return result
      })
      .then((result) => {
        setStudios((previous) =>
          previous.filter((studio) => studio._id !== deleteId)
        )

        toast.success(result.message || "Studio deleted successfully!")

        setDeleteId(null)
      })
      .catch((error) => {
        toast.error(error.message || "Something went wrong")
      })
      .finally(() => {
        setIsDeleting(false)
      })
  }

  // Loading
  if (isSessionLoading || isLoading) {
    return (
      <main className="min-h-screen bg-[#faf9ff] px-4 py-10">
        <div className="mx-auto max-w-7xl animate-pulse space-y-5">
          <div className="h-10 w-64 rounded-lg bg-slate-200" />
          <div className="h-36 rounded-xl bg-slate-200" />
          <div className="h-36 rounded-xl bg-slate-200" />
          <div className="h-36 rounded-xl bg-slate-200" />
        </div>
      </main>
    )
  }

  // Login required
  if (!userEmail) {
    return (
      <main className="grid min-h-[70vh] place-items-center bg-[#faf9ff] px-4">
        <div className="text-center">
          <Building2 className="mx-auto size-12 text-slate-300" />

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Login Required
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Please login to manage your studio listings.
          </p>

          <Button asChild className="mt-5 bg-violet-700">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#faf9ff]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Page Heading */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-xs text-violet-700">
              Host Dashboard / My Listings
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              My Studio Listings
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your creative spaces and keep your listings updated.
            </p>
          </div>

          <Button
            asChild
            className="rounded-xl bg-violet-700 hover:bg-violet-800"
          >
            <Link href="/add-studio">
              <Plus className="mr-2 size-4" />
              Add New Studio
            </Link>
          </Button>
        </div>

        {/* Statistics */}
        <Card className="mb-6 rounded-2xl border-slate-100 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="grid size-12 place-items-center rounded-xl bg-violet-100 text-violet-700">
              <Building2 className="size-6" />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Total Studio Listings
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {studios.length}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Studio Listings */}
        {studios.length > 0 ? (
          <div className="space-y-4">
            {studios.map((studio) => (
              <Card
                key={studio._id}
                className="overflow-hidden rounded-2xl border-slate-100 shadow-sm transition hover:shadow-md"
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row">

                    {/* Studio Image */}
                    <div className="h-48 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-36 sm:w-52">
                      {studio.images?.[0] ? (
                        <img
                          src={studio.images[0]}
                          alt={studio.title}
                          className="size-full object-cover"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center">
                          <ImageIcon className="size-10 text-slate-300" />
                        </div>
                      )}
                    </div>

                    {/* Studio Information */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-900">
                          {studio.title}
                        </h2>

                        <Badge className="border-0 bg-violet-100 text-violet-700 hover:bg-violet-100">
                          {studio.category}
                        </Badge>
                      </div>

                      <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                        <MapPin className="size-4 text-violet-600" />
                        {studio.location}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                        <span className="font-semibold text-violet-700">
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
                            className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] text-slate-600"
                          >
                            {amenity.replaceAll("-", " ")}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 flex-row gap-2 sm:flex-col sm:justify-center">
                      <Button
                        asChild
                        size="sm"
                        className="flex-1 rounded-lg bg-violet-700 hover:bg-violet-800 sm:flex-none"
                      >
                        <Link href={`/studios/edit/${studio._id}`}>
                          <Pencil className="mr-1.5 size-3.5" />
                          Update
                        </Link>
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteId(studio._id)}
                        className="flex-1 rounded-lg border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 sm:flex-none"
                      >
                        <Trash2 className="mr-1.5 size-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          !error && (
            <div className="rounded-2xl border border-dashed bg-white px-6 py-20 text-center">
              <Building2 className="mx-auto size-12 text-slate-300" />

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                No Studio Listings Yet
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                You haven't added any creative spaces yet.
                Start by listing your first studio.
              </p>

              <Button
                asChild
                className="mt-5 rounded-xl bg-violet-700 hover:bg-violet-800"
              >
                <Link href="/add-studio">
                  <Plus className="mr-2 size-4" />
                  Add Your First Studio
                </Link>
              </Button>
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
        <DialogContent className="rounded-2xl sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Delete Studio Listing?
            </DialogTitle>
          </DialogHeader>

          <div className="py-2">
            <div className="mb-3 grid size-12 place-items-center rounded-full bg-red-100 text-red-600">
              <Trash2 className="size-5" />
            </div>

            <p className="text-sm leading-6 text-slate-500">
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
              className="bg-red-600 hover:bg-red-700"
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
