import { Banner } from "@/components/banner"
import { BrowseCategories } from "@/components/browse-categories"
import FeaturedStudios from "@/components/featured-studios"
import { Footer } from "@/components/footer"
import { HostCta } from "@/components/host-cta"
import { HowBookingWorks } from "@/components/how-booking-works"
import { Navbar } from "@/components/navbar"
import { WhyTrustUs } from "@/components/why-trust-us"

export default function Home() {
  return (
    <>
      <main className="flex flex-1 flex-col bg-surface">
        <Banner />
        <FeaturedStudios />
        <BrowseCategories />
        <HowBookingWorks />
        <WhyTrustUs />
        <HostCta />
      </main>
    </>
  )
}
