import Image from "next/image"
import { SlidersHorizontal, Video, Zap } from "lucide-react"

const features = [
  { label: "Instant booking", icon: Zap },
  { label: "Acoustically treated", icon: SlidersHorizontal },
  { label: "Pro gear on-site", icon: Video },
]

export function Banner() {
  return (
    <section>
      <div className="mx-auto grid w-full max-w-[1380px] items-start gap-10 px-6 pt-8 pb-16 sm:px-8 min-[900px]:grid-cols-2 min-[900px]:gap-10 min-[900px]:pb-20 min-[900px]:pt-8 lg:gap-12 xl:gap-12">
        <div className="max-w-[650px]">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-1.5 text-[13px] font-semibold text-brand">
            <Zap className="size-4 fill-brand" strokeWidth={2.4} />
            Over 2,400+ creative spaces ready to book
          </span>

          <h1 className="mt-5 text-[32px] leading-[1.04] font-bold tracking-[-0.045em] text-ink sm:text-[40px] lg:text-[43px] xl:text-[54px]">
            Find the perfect
            <br />
            <span className="text-brand">creative space,</span> by the
            <br />
            <span className="text-brand">hour</span>
          </h1>

          <p className="mt-5 max-w-[530px] text-[16px] leading-7 text-slate-600 lg:text-[17px] lg:leading-8">
            Rent photo cycloramas, acoustic podcast lounges, soundproof music
            suites, and sunlight-drenched art lofts without long-term
            commitments.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#explore"
              className="inline-flex h-11 items-center justify-center rounded-full bg-brand px-6 text-sm font-semibold text-white shadow-[0_14px_28px_-14px_rgba(98,56,245,0.9)] transition-colors hover:bg-brand-strong lg:h-12 lg:px-7 lg:text-[15px]"
            >
              Explore Studios
            </a>
            <a
              href="#host"
              className="inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold text-ink transition-colors hover:bg-black/5 lg:h-12 lg:px-6 lg:text-[15px]"
            >
              Host Your Space
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] font-medium text-slate-600 lg:mt-8 lg:gap-x-4 lg:text-[13px]">
            {features.map(({ label, icon: Icon }, index) => (
              <div key={label} className="flex items-center gap-3 lg:gap-4">
                {index > 0 ? (
                  <span
                    aria-hidden="true"
                    className="size-1 rounded-full bg-slate-300"
                  />
                ) : null}
                <span className="flex items-center gap-1.5">
                  <Icon
                    className="size-3.5 text-brand lg:size-4"
                    strokeWidth={2}
                  />
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-[900px]:mt-3">
     
          <div className="relative aspect-[3/2] overflow-hidden rounded-[22px] bg-slate-200 shadow-[0_30px_60px_-35px_rgba(17,18,43,0.45)]">
            <Image
              src="/images/banner.jpg"
              alt="A photographer and models working inside a bright studio space"
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 900px) 50vw, 100vw"
              className="object-cover"
            />

          
          </div>
        </div>
      </div>
    </section>
  )
}
