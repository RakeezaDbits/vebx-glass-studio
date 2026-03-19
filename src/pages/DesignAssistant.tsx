import PageLayout from "@/components/PageLayout";
import DesignAssistantContent from "@/components/DesignAssistantContent";

export default function DesignAssistant() {
  return (
    <PageLayout
      seo={{
        title: "AI Chatbot",
        description:
          "Chat with our AI assistant: describe your idea in messages, generate design reference images for websites and apps, and attach them to Get a Quote — no login required.",
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
                  AI Chatbot
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Type messages with your idea — we generate reference images for web and app designs
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
