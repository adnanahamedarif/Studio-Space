import Link from "next/link"

import {
  AudioLines,
  Camera,
  Mic,
  Palette,
  Warehouse,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"

type Category = {
  title: string
  description: string
  spaces: string
  icon: LucideIcon
  href: string
}

const categories: Category[] = [
  {
    title: "Photo Studios",
    description: "Seamless backdrops, daylight grids & whole sets",
    spaces: "620+ spaces",
    icon: Camera,
    href: "/studios?category=Photo%20Studio",
  },
  {
    title: "Sound Stages",
    description: "Drive-on access, green rooms & high ceilings",
    spaces: "310+ spaces",
    icon: Warehouse,
    href: "/studios?category=Film%20Stage",
  },
  {
    title: "Podcast Rooms",
    description: "Studio mics, mixers & acoustic treatment",
    spaces: "480+ spaces",
    icon: Mic,
    href: "/studios?category=Podcast%20Lounge",
  },
  {
    title: "Music Suites",
    description: "Treated live rooms, monitor pairs & analog gear",
    spaces: "520+ spaces",
    icon: AudioLines,
    href: "/studios?category=Music%20Suite",
  },
  {
    title: "Art Workshops",
    description: "Ventilated kilns, pottery wheels & natural light",
    spaces: "260+ spaces",
    icon: Palette,
    href: "/studios?category=Workshop",
  },
]

export function BrowseCategories() {
  return (
    <section
      id="explore"
      className="bg-surface py-16 transition-colors duration-300 lg:py-20"
    >
      <div className="mx-auto w-full max-w-[1380px] px-6 sm:px-8">

        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-brand uppercase">
            Explore by craft
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-foreground sm:text-4xl">
            Browse by Category
          </h2>

          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Find production environments tailored specifically to your craft.
          </p>
        </div>

        {/* Category Cards */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 wide:grid-cols-5">
          {categories.map(({ title, description, spaces, icon: Icon, href }) => (
            <Link
              key={title}
              href={href}
              className="block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <Card className="h-full gap-0 border-border bg-card py-5 text-card-foreground shadow-[0_12px_30px_-24px_rgba(17,18,43,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="flex h-full flex-col px-5">

                  {/* Icon */}
                  <span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand">
                    <Icon className="size-5" strokeWidth={1.8} />
                  </span>

                  {/* Title */}
                  <CardTitle
                    role="heading"
                    aria-level={3}
                    className="mt-4 text-[15px] font-semibold text-card-foreground"
                  >
                    {title}
                  </CardTitle>

                  {/* Description */}
                  <CardDescription className="mt-2 text-[13px] leading-5 text-muted-foreground">
                    {description}
                  </CardDescription>

                  {/* Spaces Badge */}
                  <div className="mt-auto pt-5">
                    <Badge
                      variant="secondary"
                      className="w-fit rounded-full bg-brand-soft px-2.5 text-[11px] font-medium text-brand"
                    >
                      {spaces}
                    </Badge>
                  </div>

                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}