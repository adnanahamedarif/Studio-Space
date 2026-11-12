
"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import ThemeToggle from "@/components/theme-toggle";
import { useState } from "react"
import {
  Menu,
  X,
  Home,
  LayoutDashboard,
  CalendarDays,
  PlusCircle,
  UserRound,
  LogOut,
  ChevronDown,
} from "lucide-react"

import { cn } from "cn"
import { authClient } from "@/lib/auth-client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Button } from "@/components/ui/button"

const links = [
  { label: "Home", href: "/", icon: Home },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About Us", href: "/#about" },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  const { data: session } = authClient.useSession()
  const user = session?.user

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSignout = async () => {
    await authClient.signOut()
    setMobileMenuOpen(false)
    router.push("/")
    router.refresh()
  }

  const dashboardLinks = [
    { label: "My Bookings", href: "/my-bookings", icon: CalendarDays },
    { label: "My Studio Listings", href: "/my-listings", icon: LayoutDashboard },
    { label: "Add Studio Space", href: "/add-studio", icon: PlusCircle },
  ]

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex min-h-20 max-w-[1380px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* Logo */}
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

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "whitespace-nowrap text-sm font-medium transition-colors hover:text-violet-700",
                isActive(link.href)
                  ? "font-semibold text-violet-700"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}

          {user && dashboardLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "whitespace-nowrap text-sm font-medium transition-colors hover:text-violet-700",
                isActive(link.href)
                  ? "font-semibold text-violet-700"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">

          {user ? (
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-slate-200 p-1.5 pr-3 transition hover:bg-accent">
                  <Avatar className="size-9">
                    <AvatarImage
                      src={user.image || ""}
                      referrerPolicy="no-referrer"
                    />
                    <AvatarFallback>
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <span className="hidden max-w-28 truncate text-sm font-semibold text-foreground sm:block">
                    {user.name}
                  </span>

                  <ChevronDown className="size-4 text-muted-foreground" />
                </button>
              </PopoverTrigger>

              <PopoverContent align="end" className="w-64 p-2">
                <div className="border-b px-3 py-3">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>

                <div className="space-y-1 py-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition hover:bg-violet-50 hover:text-violet-700"
                  >
                    <UserRound className="size-4" />
                    My Profile
                  </Link>

                  {dashboardLinks.map((link) => {
                    const Icon = link.icon

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-foreground transition hover:bg-violet-50 hover:text-violet-700"
                      >
                        <Icon className="size-4" />
                        {link.label}
                      </Link>
                    )
                  })}
                </div>

                <div className="border-t pt-2">
                  <button
                    onClick={handleSignout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut className="size-4" />
                    Logout
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="hidden items-center gap-3 sm:flex">
              <Link
                href="/login"
                className="px-3 py-2 text-sm font-semibold text-foreground transition hover:text-violet-700"
              >
                Login
              </Link>

              <Button
                asChild
                className="rounded-full bg-violet-700 px-6 hover:bg-violet-800"
              >
                <Link href="/register">Register</Link>
              </Button>

            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-foreground transition hover:bg-slate-100 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border 	bg-background px-5 py-4 shadow-lg lg:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-3 text-sm font-medium transition hover:bg-violet-50 hover:text-violet-700",
                  isActive(link.href)
                    ? "bg-violet-50 text-violet-700"
                    : "text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
             <ThemeToggle />

            {user && dashboardLinks.map((link) => {
              const Icon = link.icon

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-foreground transition hover:bg-violet-50 hover:text-violet-700"
                >
                  <Icon className="size-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-3 border-t pt-4">
            {user ? (
              <div className="space-y-3">
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-violet-50"
                >
                  <UserRound className="size-4" />
                  My Profile
                </Link>

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleSignout}
                >
                  <LogOut className="mr-2 size-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/login"
                  className="inline-flex flex-1 items-center justify-center rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="inline-flex flex-1 items-center justify-center rounded-md bg-violet-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-800"
                >
                 Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
