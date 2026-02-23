import HomeNavbar from '@/components/HomeNavbar';
import HeroSection from '@/pages/home/HeroSection';
import ForEnterprisesSection from '@/pages/home/ForEnterprisesSection';
import ForStartupsSection from '@/pages/home/ForStartupsSection';
import StatsSection from '@/pages/home/StatsSection';
import HowItWorksSection from '@/pages/home/HowItWorksSection';
import CTASection from '@/pages/home/CTASection';
import FooterSection from '@/pages/home/FooterSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-home-neutral font-sans">
      <HomeNavbar />
      <main>
        <HeroSection />
        <ForEnterprisesSection />
        <ForStartupsSection />
        <StatsSection />
        <HowItWorksSection />
        <CTASection />
        <FooterSection />
      </main>
    </div>
  );
}
