import { Button } from "@/components/ui/button"

const steps = [
  {
    number: "01",
    title: "Discover Spaces",
    description:
      "Search and filter by hourly rate, ceiling height, gear list, and instant availability.",
  },
  {
    number: "02",
    title: "Select Shoot Hours",
    description:
      "Choose exact start and end times with transparent upfront pricing and no hidden cleaning surprises.",
  },
  {
    number: "03",
    title: "Book Instantly",
    description:
      "Secure your slot in seconds with automated door codes, host direct messaging, and verified insurance.",
  },
  {
    number: "04",
    title: "Create & Produce",
    description:
      "Check in seamlessly, plug into pro equipment, and focus 100% on bringing your vision to life.",
  },
]

export function HowBookingWorks() {
  return (
    <section id="how-it-works" className="bg-white py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1380px] px-6 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-brand uppercase">
            Simple workflow
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-ink sm:text-4xl">
            How Booking Works
          </h2>
          <p className="mt-3 text-sm text-slate-500 sm:text-base">
            Seamless from initial discovery to wrapping your production.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 wide:grid-cols-4">
          {steps.map(({ number, title, description }) => (
            <div key={number}>
              <span className="grid size-9 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand">
                {number}
              </span>
              <h3 className="mt-4 text-[15px] font-semibold text-ink">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            nativeButton={false}
            render={<a href="#how-it-works" />}
            className="h-10 rounded-full bg-brand px-6 text-sm font-semibold text-white shadow-[0_12px_24px_-14px_rgba(98,56,245,0.9)] hover:bg-brand-strong"
          >
            Learn More About Our Process
          </Button>
        </div>
      </div>
    </section>
  )
}
