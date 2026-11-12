
import {
  BadgeCheck,
  ClipboardCheck,
  Headphones,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"

type TrustPoint = {
  title: string
  description: string
  icon: LucideIcon
}

const trustPoints: TrustPoint[] = [
  {
    title: "Liability Protection",
    description:
      "Every hourly booking includes up to $1M in coverage, so you can create without a second thought to peace of mind.",
    icon: ShieldCheck,
  },
  {
    title: "Verified Profiles",
    description:
      "All studio hosts and talent undergo identity and space checks.",
    icon: BadgeCheck,
  },
  {
    title: "Equipment Safety",
    description:
      "Transparent gear inventories with optional add-ons and verified protection guarantees.",
    icon: ClipboardCheck,
  },
  {
    title: "24/7 Host Support",
    description:
      "Dedicated production support from real people on call and phone around the clock.",
    icon: Headphones,
  },
]

export function WhyTrustUs() {
  return (
    <section
      id="about"
      className="bg-surface py-16 transition-colors duration-300 lg:py-20"
    >
      <div className="mx-auto w-full max-w-[1380px] px-6 sm:px-8">

        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-brand uppercase">
            Operational integrity
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-foreground sm:text-4xl">
            Why Creators &amp; Hosts Trust Us
          </h2>

          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Built specifically with creative professionals in mind.
          </p>
        </div>

        {/* Trust Points */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 wide:grid-cols-4">
          {trustPoints.map(({ title, description, icon: Icon }) => (
            <Card
              key={title}
              className="h-full gap-0 border-border bg-card py-5 text-card-foreground shadow-[0_12px_30px_-24px_rgba(17,18,43,0.35)] transition-colors duration-300"
            >
              <CardContent className="flex h-full flex-col px-5">

                {/* Icon */}
                <span className="grid size-9 place-items-center rounded-lg bg-brand-soft text-brand">
                  <Icon className="size-[18px]" strokeWidth={1.8} />
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

              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </section>
  )
}
