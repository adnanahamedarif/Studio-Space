import Link from "next/link"
import {
  Aperture,
  Briefcase,
  Camera,
  Hash,
  PlayCircle,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "#explore" },
  { label: "Host a Space", href: "#host" },
  { label: "Pricing", href: "#pricing" },
  { label: "Studio Guidelines", href: "#guidelines" },
  { label: "Support Center", href: "#support" },
]

const categories = [
  { label: "Photo Studios", href: "#explore" },
  { label: "Sound Stages", href: "#explore" },
  { label: "Podcast Rooms", href: "#explore" },
  { label: "Music Suites", href: "#explore" },
  { label: "Art Workshops", href: "#explore" },
]

const socials: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Community", href: "#", icon: Hash },
  { label: "Instagram", href: "#", icon: Camera },
  { label: "YouTube", href: "#", icon: PlayCircle },
  { label: "Careers", href: "#", icon: Briefcase },
]

export function Footer() {
  return (
    <footer id="footer" className="border-t border-slate-200/70 bg-white">
      <div className="mx-auto w-full max-w-[1380px] px-6 pt-16 pb-12 sm:px-8">
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.9fr_0.9fr_1.5fr] xl:grid-cols-12">
          <div className="xl:col-span-4">
            <Link
              href="/"
              aria-label="StudioSpace home"
              className="inline-flex items-center gap-2.5"
            >
              <span className="grid size-6 place-items-center rounded-full bg-brand text-white">
                <Aperture className="size-3.5" strokeWidth={2.2} />
              </span>
              <span className="text-[19px] font-bold tracking-[-0.03em] text-ink">
                StudioSpace
              </span>
            </Link>

            <p className="mt-4 max-w-[350px] text-sm leading-6 text-slate-600">
              Empowering photographers, podcasters, musicians, and filmmakers
              with on-demand creative sanctuaries by the hour.
            </p>

            <div className="mt-5 flex items-center gap-2.5">
              {socials.map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid size-9 place-items-center rounded-full bg-brand-soft/70 text-ink transition-colors hover:bg-brand-soft hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2"
                >
                  <Icon className="size-4" strokeWidth={1.8} />
                </Link>
              ))}
            </div>
          </div>

          <nav aria-label="Quick links" className="xl:col-span-2">
            <h2 className="text-[11px] font-semibold tracking-[0.08em] text-ink uppercase">
              Quick Links
            </h2>
            <ul className="mt-4 space-y-1.5">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-slate-600 transition-colors hover:text-brand"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav
            aria-label="Popular categories"
            className="xl:col-span-2"
          >
            <h2 className="text-[11px] font-semibold tracking-[0.08em] text-ink uppercase">
              Popular Categories
            </h2>
            <ul className="mt-4 space-y-1.5">
              {categories.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-slate-600 transition-colors hover:text-brand"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="xl:col-span-4">
            <h2 className="text-[11px] font-semibold tracking-[0.08em] text-ink uppercase">
              Newsletter
            </h2>
            <p className="mt-3 max-w-[360px] text-[13px] leading-5 text-slate-500">
              Get curated studio drops, host perks, and creative inspiration in
              your inbox.
            </p>
            <div className="mt-4 flex gap-2">
              <Input
                type="email"
                aria-label="Email address"
                placeholder="Enter your creative email"
                className="h-9 min-w-0 flex-1 rounded-full border-0 bg-brand-soft/70 px-4 text-[13px] placeholder:text-slate-400 focus-visible:ring-brand/20"
              />
              <Button
                type="button"
                className="h-9 rounded-full bg-brand px-4 text-[13px] font-semibold text-white hover:bg-brand-strong"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-24 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-slate-500">
            © 2025 StudioSpace Inc. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="#privacy"
              className="text-[13px] text-slate-500 transition-colors hover:text-brand"
            >
              Privacy Policy
            </Link>
            <Link
              href="#terms"
              className="text-[13px] text-slate-500 transition-colors hover:text-brand"
            >
              Terms of Service
            </Link>
            <Link
              href="#cookies"
              className="text-[13px] text-slate-500 transition-colors hover:text-brand"
            >
              Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
