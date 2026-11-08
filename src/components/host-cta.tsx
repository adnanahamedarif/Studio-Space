import { Button } from "@/components/ui/button"

export function HostCta() {
  return (
    <section id="host" className="bg-white pt-4 pb-16 lg:pb-20">
      <div className="mx-auto w-full max-w-[1380px] px-6 sm:px-8">
        <div
          id="list-your-space"
          className="flex flex-col gap-6 rounded-2xl bg-brand px-6 py-8 shadow-[0_28px_60px_-30px_rgba(98,56,245,0.65)] sm:flex-row sm:items-center sm:justify-between lg:px-10"
        >
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-[-0.03em] text-white sm:text-3xl">
              Have an unused creative space?
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/80 sm:text-base">
              List your daylight studio, audio booth, or rehearsal loft and earn
              an average of $3,000/month by hosting top local creators.
            </p>
          </div>
          <Button
            render={<a href="#list-your-space" />}
            className="h-11 shrink-0 self-start rounded-full bg-white px-6 text-sm font-semibold text-ink hover:bg-white/90 sm:self-auto"
          >
            List Your Space
          </Button>
        </div>
      </div>
    </section>
  )
}
