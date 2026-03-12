import PageLayout from "@/components/PageLayout";
import HeroSection from "@/components/HeroSection";
import HeroBelowSection from "@/components/HeroBelowSection";
import TrustedSection from "@/components/TrustedSection";
import AboutSection from "@/components/AboutSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import ServicesSection from "@/components/ServicesSection";
import HowWeWorkSection from "@/components/HowWeWorkSection";
import CTASection from "@/components/CTASection";

const Index = () => (
  <PageLayout>
    <HeroSection />
    <HeroBelowSection />
    <TrustedSection />
    <AboutSection />
    <WhyChooseSection />
    <ServicesSection />
    <HowWeWorkSection />
    <CTASection />
  </PageLayout>
);

export default Index;
