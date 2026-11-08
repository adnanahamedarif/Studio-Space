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
}

const categories: Category[] = [
  {
    title: "Photo Studios",
    description: "Seamless backdrops, daylight grids & whole sets",
    spaces: "620+ spaces",
    icon: Camera,
  },
  {
    title: "Sound Stages",
    description: "Drive-on access, green rooms & high ceilings",
    spaces: "310+ spaces",
    icon: Warehouse,
  },
  {
    title: "Podcast Rooms",
    description: "Studio mics, mixers & acoustic treatment",
    spaces: "480+ spaces",
    icon: Mic,
  },
  {
    title: "Music Suites",
    description: "Treated live rooms, monitor pairs & analog gear",
    spaces: "520+ spaces",
    icon: AudioLines,
  },
  {
    title: "Art Workshops",
    description: "Ventilated kilns, pottery wheels & natural light",
    spaces: "260+ spaces",
    icon: Palette,
  },
]

export function BrowseCategories() {
  return (
    <section id="explore" className="bg-surface py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1380px] px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-brand uppercase">
            Explore by craft
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-ink sm:text-4xl">
            Browse by Category
          </h2>
          <p className="mt-3 text-sm text-slate-500 sm:text-base">
            Find production environments tailored specifically to your craft.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 wide:grid-cols-5">
          {categories.map(({ title, description, spaces, icon: Icon }) => (
            <Card
              key={title}
              className="h-full gap-0 py-5 shadow-[0_12px_30px_-24px_rgba(17,18,43,0.35)] ring-slate-200/80"
            >
              <CardContent className="flex h-full flex-col px-5">
                <span className="grid size-10 place-items-center rounded-xl bg-brand-soft text-brand">
                  <Icon className="size-5" strokeWidth={1.8} />
                </span>
                <CardTitle
                  role="heading"
                  aria-level={3}
                  className="mt-4 text-[15px] font-semibold text-ink"
                >
                  {title}
                </CardTitle>
                <CardDescription className="mt-2 text-[13px] leading-5 text-slate-500">
                  {description}
                </CardDescription>
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
          ))}
        </div>
      </div>
    </section>
  )
}
