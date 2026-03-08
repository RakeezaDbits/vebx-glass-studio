import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickySocialLeft from "@/components/StickySocialLeft";
import StickyContactRight from "@/components/StickyContactRight";
import CursorGlassBall from "@/components/CursorGlassBall";

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <CursorGlassBall />
      <Header />
      <StickySocialLeft />
      <StickyContactRight />
      <main className="pt-16 min-h-[calc(100vh-4rem)]">{children}</main>
      <Footer />
    </div>
  );
}
