import Hero from "@/components/Hero";
import GreetingBanner from "@/components/GreetingBanner";
import Courses from "@/components/Courses";
import Contact from "@/components/Contact";
import { TrustStrip, About, Process, Gallery, Stories, Reviews, CtaPanel } from "@/components/Sections";
import Placements from "@/components/Placements";
export default function Home() {
  return (
    <main>
      <Hero />
      <TrustStrip />
      <GreetingBanner />
      <About />
      <Courses />
      <Process />
      <Gallery />
      <Stories />
      <Placements />
      <Reviews />
      <CtaPanel />
      <Contact />
    </main>
  );
}
