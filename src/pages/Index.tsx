import { useTranslation } from "react-i18next";
import PageLayout from "@/components/PageLayout";
import HeroSection from "@/components/HeroSection";
import TrustedSection from "@/components/TrustedSection";
import AboutSection from "@/components/AboutSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import ServicesSection from "@/components/ServicesSection";
import HowWeWorkSection from "@/components/HowWeWorkSection";
import CTASection from "@/components/CTASection";
import PartnersSection from "@/components/PartnersSection";

const Index = () => {
  const { t } = useTranslation();
  return (
    <PageLayout
      seo={{
        title: t("seo.homeTitle"),
        description: t("seo.homeDescription"),
        canonicalPath: "/",
      }}
    >
      <HeroSection />
      <TrustedSection />
      <AboutSection />
      <WhyChooseSection />
      <HowWeWorkSection />
      <CTASection />
      <ServicesSection />
      <PartnersSection />
    </PageLayout>
  );
};

export default Index;
