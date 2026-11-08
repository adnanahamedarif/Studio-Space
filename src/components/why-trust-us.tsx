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
    <section id="about" className="bg-surface py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1380px] px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-brand uppercase">
            Operational integrity
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-ink sm:text-4xl">
            Why Creators &amp; Hosts Trust Us
          </h2>
          <p className="mt-3 text-sm text-slate-500 sm:text-base">
            Built specifically with creative professionals in mind.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 wide:grid-cols-4">
          {trustPoints.map(({ title, description, icon: Icon }) => (
            <Card
              key={title}
              className="h-full gap-0 py-5 shadow-[0_12px_30px_-24px_rgba(17,18,43,0.35)] ring-slate-200/80"
            >
              <CardContent className="flex h-full flex-col px-5">
                <span className="grid size-9 place-items-center rounded-lg bg-brand-soft text-brand">
                  <Icon className="size-[18px]" strokeWidth={1.8} />
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
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
