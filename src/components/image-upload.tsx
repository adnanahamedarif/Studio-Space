
"use client"

import { useState } from "react"
import { ImagePlus, Plus, X, Link2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type ImageUrlUploadProps = {
  value: string[]
  onChange: (images: string[]) => void
}

export function ImageUrlUpload({
  value,
  onChange,
}: ImageUrlUploadProps) {
  const [imageUrl, setImageUrl] = useState("")
  const [error, setError] = useState("")
  const [failedImages, setFailedImages] = useState<string[]>([])

  const handleAddImage = () => {
    const url = imageUrl.trim()

    if (!url) {
      setError("Please enter an image URL.")
      return
    }

    try {
      const parsedUrl = new URL(url)

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        setError("Please enter a valid HTTP or HTTPS URL.")
        return
      }
    } catch {
      setError("Please enter a valid image URL.")
      return
    }

    if (value.includes(url)) {
      setError("This image URL is already added.")
      return
    }

    if (value.length >= 10) {
      setError("Maximum 10 images allowed.")
      return
    }

    onChange([...value, url])
    setImageUrl("")
    setError("")
  }

  const removeImage = (url: string) => {
    onChange(value.filter((image) => image !== url))
    setFailedImages((prev) => prev.filter((image) => image !== url))
  }

  return (
    <div className="space-y-5">

      {/* URL Input */}
      <div className="space-y-2">
        <label
          htmlFor="studio-image-url"
          className="text-xs font-medium text-foreground"
        >
          Image URL
        </label>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Link2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              id="studio-image-url"
              type="url"
              placeholder="https://example.com/studio-image.jpg"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value)
                setError("")
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddImage()
                }
              }}
              className="h-11 border-border bg-background pl-9 text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <Button
            type="button"
            onClick={handleAddImage}
            disabled={!imageUrl.trim() || value.length >= 10}
            className="h-11 bg-brand text-white hover:bg-brand-strong"
          >
            <Plus className="size-4" />
            Add Image
          </Button>
        </div>

        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}

        <p className="text-[11px] text-muted-foreground">
          Paste an image URL. Supports JPG, PNG and WEBP.
          Maximum 10 images.
        </p>
      </div>

      {/* Preview Header */}
      <div className="flex items-center justify-between border-t border-border pt-4">
        <div>
          <p className="text-sm font-semibold text-foreground">
            Image Preview
          </p>

          <p className="text-xs text-muted-foreground">
            Your studio images will appear here.
          </p>
        </div>

        <Badge variant="secondary">
          {value.length}/10 Added
        </Badge>
      </div>

      {/* Preview Grid */}
      {value.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((url, index) => (
            <div
              key={url}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-muted"
            >
              {!failedImages.includes(url) ? (
                <img
                  src={url}
                  alt={`Studio image ${index + 1}`}
                  loading="lazy"
                  className="size-full object-cover transition duration-300 group-hover:scale-105"
                  onError={() => {
                    setFailedImages((prev) =>
                      prev.includes(url) ? prev : [...prev, url]
                    )
                  }}
                />
              ) : (
                <div className="flex size-full flex-col items-center justify-center gap-2 p-3 text-center">
                  <ImagePlus className="size-7 text-muted-foreground" />

                  <p className="text-xs text-red-500">
                    Unable to load image
                  </p>
                </div>
              )}

              {index === 0 && !failedImages.includes(url) && (
                <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white">
                  Main Photo
                </span>
              )}

              <button
                type="button"
                onClick={() => removeImage(url)}
                aria-label="Remove image"
                className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-black/60 text-white transition hover:bg-red-500"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}

          {value.length < 10 && (
            <button
              type="button"
              onClick={() =>
                document.getElementById("studio-image-url")?.focus()
              }
              className="flex aspect-[4/3] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted text-muted-foreground transition hover:border-brand hover:text-brand"
            >
              <Plus className="size-6" />

              <span className="mt-2 text-xs font-medium">
                Add More
              </span>
            </button>
          )}
        </div>
      ) : (
        <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted px-4 py-8 text-center">
          <ImagePlus className="size-9 text-muted-foreground" />

          <p className="mt-3 text-sm font-medium text-foreground">
            No images added yet
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Paste an image URL above to see the preview.
          </p>
        </div>
      )}
    </div>
  )
}
