import { About } from "./(section)/About"
import HeroPage from "./(section)/Hero"
import { MenuSection } from "./(section)/MenuSection"
import { Banner } from "./(section)/Banner"
import { Footer } from "./(section)/Footer"
import { Navbar } from "./(section)/Navbar"
import { Contact } from "./(section)/Contact"
import { Highlights } from "./(section)/Highlights"
import { ErrorBoundary } from "@/components/error-fallback"
import { getToko } from "@/lib/server/toko.service"

export default async function Page() {
  const toko = await getToko()
  return (
    <>
    <Navbar storeName={toko.nama} />
    <main id="beranda">
     <HeroPage />
    <Highlights />
    <About />
      <ErrorBoundary title="Menu belum dapat dimuat" description="Daftar menu sedang tidak tersedia. Silakan coba lagi.">
        <MenuSection />
      </ErrorBoundary>
    <Banner />
    <Contact />
    </main>
    <div className="pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0"><Footer /></div>
    </>
  )
}
