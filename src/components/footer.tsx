
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
import Image from "next/image"

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "Host a Space", href: "/add-studio" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Studio Guidelines", href: "/#guidelines" },
  { label: "Support Center", href: "/#support" },
]

const categories = [
  { label: "Photo Studios", href: "/studios" },
  { label: "Sound Stages", href: "/studios" },
  { label: "Podcast Rooms", href: "/studios" },
  { label: "Music Suites", href: "/studios" },
  { label: "Art Workshops", href: "/studios" },
]

const socials: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Community", href: "#", icon: Hash },
  { label: "Instagram", href: "#", icon: Camera },
  { label: "YouTube", href: "#", icon: PlayCircle },
  { label: "Careers", href: "#", icon: Briefcase },
]

export function Footer() {
  return (
    <footer
      id="footer"
      className="border-t border-border bg-background text-foreground transition-colors duration-300"
    >
      <div className="mx-auto w-full max-w-[1380px] px-6 pt-16 pb-12 sm:px-8">

        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.9fr_0.9fr_1.5fr] xl:grid-cols-12">

          {/* Brand and Social Links */}
          <div className="xl:col-span-4">
            <Link href="/" aria-label="StudioSpace Home" className="shrink-0">
          <Image
            src="/images/logo.png"
            alt="StudioSpace"
            width={1040}
            height={240}
            priority
            className="h-10 w-auto sm:h-11"
          />
        </Link>

            <p className="mt-4 max-w-[350px] text-sm leading-6 text-muted-foreground">
              Empowering photographers, podcasters, musicians, and filmmakers
              with on-demand creative sanctuaries by the hour.
            </p>

            <div className="mt-5 flex items-center gap-2.5">
              {socials.map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid size-9 place-items-center rounded-full bg-brand-soft/70 text-foreground transition-colors hover:bg-brand-soft hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2"
                >
                  <Icon className="size-4" strokeWidth={1.8} />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Quick links" className="xl:col-span-2">
            <h2 className="text-[11px] font-semibold tracking-[0.08em] text-foreground uppercase">
              Quick Links
            </h2>

            <ul className="mt-4 space-y-1.5">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground transition-colors hover:text-brand"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Categories */}
          <nav
            aria-label="Popular categories"
            className="xl:col-span-2"
          >
            <h2 className="text-[11px] font-semibold tracking-[0.08em] text-foreground uppercase">
              Popular Categories
            </h2>

            <ul className="mt-4 space-y-1.5">
              {categories.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground transition-colors hover:text-brand"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Newsletter */}
          <div className="xl:col-span-4">
            <h2 className="text-[11px] font-semibold tracking-[0.08em] text-foreground uppercase">
              Newsletter
            </h2>

            <p className="mt-3 max-w-[360px] text-[13px] leading-5 text-muted-foreground">
              Get curated studio drops, host perks, and creative inspiration in
              your inbox.
            </p>

            <div className="mt-4 flex gap-2">
              <Input
                type="email"
                aria-label="Email address"
                placeholder="Enter your creative email"
                className="h-9 min-w-0 flex-1 rounded-full border-border bg-muted px-4 text-[13px] text-foreground placeholder:text-muted-foreground focus-visible:ring-brand/20"
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

        {/* Bottom Footer */}
        <div className="mt-24 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-[13px] text-muted-foreground">
            © 2025 StudioSpace Inc. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="#privacy"
              className="text-[13px] text-muted-foreground transition-colors hover:text-brand"
            >
              Privacy Policy
            </Link>

            <Link
              href="#terms"
              className="text-[13px] text-muted-foreground transition-colors hover:text-brand"
            >
              Terms of Service
            </Link>

            <Link
              href="#cookies"
              className="text-[13px] text-muted-foreground transition-colors hover:text-brand"
            >
              Cookie Settings
            </Link>
          </div>

        </div>
      </div>
    </footer>
  )
}
