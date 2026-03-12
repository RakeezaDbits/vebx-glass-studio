import { useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CursorGlassBall from "@/components/CursorGlassBall";
import SeoHead, { SeoHeadProps } from "@/components/SeoHead";

export default function PageLayout({
  children,
  seo,
}: {
  children: React.ReactNode;
  seo?: SeoHeadProps;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  return (
    <div className="min-h-screen bg-background">
      {seo && <SeoHead {...seo} />}
      <div ref={contentRef}>
        <Header />
        <main className="pt-16 min-h-[calc(100vh-4rem)]">{children}</main>
        <Footer />
      </div>
      <CursorGlassBall contentRef={contentRef} />
    </div>
  );
}
