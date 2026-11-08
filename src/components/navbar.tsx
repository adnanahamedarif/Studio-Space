import Image from "next/image"
import Link from "next/link"
import { UserRound } from "lucide-react"
import { cn } from "cn"

const links = [
  { label: "Home", href: "#", active: true },
  { label: "Explore Studios", href: "explore" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About Us", href: "#about" },
]

export function Navbar() {
  return (
    <header className="relative z-10">
      <div className="mx-auto flex min-h-20 w-full max-w-[1380px] flex-wrap items-center gap-x-4 gap-y-3 px-6 py-4 sm:gap-x-8 sm:px-8 min-[900px]:grid min-[900px]:grid-cols-[1fr_auto_1fr]">
        <Link href="/" aria-label="StudioSpace home" className="shrink-0">
          <Image
            src="/images/logo.png"
            alt="StudioSpace"
            width={1040}
            height={240}
            loading="eager"
            className="h-10 w-auto sm:h-11"
          />
        </Link>

        <nav
          aria-label="Main"
          className="order-3 flex w-full flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:flex-nowrap sm:justify-start sm:gap-x-6 min-[900px]:order-none min-[900px]:w-auto min-[900px]:justify-self-center min-[900px]:gap-8 lg:gap-10 xl:gap-12"
        >
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              aria-current={link.active ? "page" : undefined}
              className={cn(
                "text-[15px] font-medium transition-colors hover:text-brand",
                link.active ? "text-brand" : "text-slate-700"
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 sm:gap-5 min-[900px]:ml-0 min-[900px]:justify-self-end">
          <a
            href="#login"
            className="hidden text-[15px] font-medium text-ink transition-colors hover:text-brand sm:inline"
          >
            Login
          </a>
          <a
            href="#register"
            className="inline-flex h-10 items-center justify-center rounded-full bg-brand px-5 text-sm font-semibold text-white shadow-[0_10px_22px_-12px_rgba(98,56,245,0.9)] transition-colors hover:bg-brand-strong sm:h-11 sm:px-7"
          >
            Register
          </a>
          <button
            type="button"
            aria-label="Open account menu"
            className="hidden size-10 place-items-center rounded-full bg-brand text-white transition-colors hover:bg-brand-strong sm:grid"
          >
            <UserRound className="size-[18px]" strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </header>
  )
}
