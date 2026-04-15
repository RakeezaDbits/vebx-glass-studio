import PageLayout from "@/components/PageLayout";
import DesignAssistantContent from "@/components/DesignAssistantContent";
import { useTranslation } from "react-i18next";

export default function DesignAssistant() {
  const { t } = useTranslation();

  return (
    <PageLayout
      seo={{
        title: t("designAssistant.seoTitle"),
        description: t("designAssistant.seoDescription"),
        canonicalPath: "/design-assistant",
      }}
    >
      <section className="relative py-10 md:py-16">
        <div className="container px-4 lg:px-8 max-w-3xl mx-auto">
          <div className="liquid-glass-card rounded-2xl border-glow overflow-hidden">
            <div className="flex items-center gap-4 p-5 md:p-6 border-b border-border/80 bg-primary/5">
              <img
                src="/chatbot-robot-btn.png"
                alt=""
                width={56}
                height={56}
                className="h-14 w-14 rounded-2xl object-cover ring-2 ring-primary/25 shrink-0 chatbot-robot-gif"
              />
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                  {t("designAssistant.title")}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("designAssistant.heroDescription")}
                </p>
              </div>
            </div>
            <DesignAssistantContent className="p-5 md:p-6 pb-8" />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
