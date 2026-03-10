import { HeroSection } from "@/presentation/components/features/portfolio/hero-section";
import { ProjectsSection } from "@/presentation/components/features/portfolio/projects-section";
import { PortfolioFooter } from "@/presentation/components/features/portfolio/portfolio-footer";
import { PortfolioPage } from "./portfolio-page";

export default function Home() {
  return (
    <PortfolioPage>
      <HeroSection />
      <ProjectsSection />
      <PortfolioFooter />
    </PortfolioPage>
  );
}
