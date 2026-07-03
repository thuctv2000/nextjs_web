import {
  SmoothScroll,
  Cursor,
  Preloader,
  PortfolioHeader,
  Frame,
  HeroSection,
  Marquee,
  BigWord,
  Craft,
  Stats,
  ProjectsSection,
  ContactSection,
} from "@/presentation/components/features/portfolio";

export default function Home() {
  return (
    <div className="portfolio-root">
      <SmoothScroll />
      <Cursor />
      <Preloader />
      <PortfolioHeader />
      <Frame />
      <main>
        <HeroSection />
        <Marquee />
        <BigWord />
        <Craft />
        <Stats />
        <ProjectsSection />
        <ContactSection />
      </main>
      <div className="grain" aria-hidden />
    </div>
  );
}
