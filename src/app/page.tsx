import { Banner } from "@/components/banner"
import { Navbar } from "@/components/navbar"

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-surface">
      <Navbar />
      <Banner />
    </main>
  )
}
