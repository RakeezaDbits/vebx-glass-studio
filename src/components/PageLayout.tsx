import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeoHead, { SeoHeadProps } from "@/components/SeoHead";

export default function PageLayout({
  children,
  seo,
}: {
  children: React.ReactNode;
  seo?: SeoHeadProps;
}) {
  return (
    <div className="min-h-screen relative">
      {seo && <SeoHead {...seo} />}
      <div>
        <Header />
        <main className="pt-16 min-h-[calc(100vh-4rem)]">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
