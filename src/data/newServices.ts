import type { LucideIcon } from "lucide-react";
import { Bot, BookOpen, Youtube, BookMarked, Newspaper, Mic2, BarChart3, MessageCircle, PenLine, Megaphone } from "lucide-react";

export interface NewServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  icon: LucideIcon;
  image: string;       // card thumbnail (listing page)
  bannerImage: string; // hero/banner (single detail page)
  features: string[];
  highlights: { title: string; desc: string }[];
}

export const newServicesData: NewServiceItem[] = [
  {
    id: "ai",
    slug: "ai",
    title: "AI Solutions",
    shortDesc: "Chatbots, automation, and intelligent workflows powered by AI to streamline operations and engage users.",
    longDesc: "We build AI-powered solutions that transform how you work and engage. From custom chatbots and virtual assistants to process automation and intelligent workflows, we help you leverage AI to save time, scale support, and deliver better experiences. Our solutions integrate with your existing tools and are designed for real-world reliability.",
    icon: Bot,
    image: "/new-services/ai-card.png",
    bannerImage: "/new-services/ai.png",
    features: ["Custom chatbots & virtual assistants", "Process automation & workflows", "LLM integration & fine-tuning", "API integrations", "Analytics & optimization"],
    highlights: [
      { title: "Tailored to you", desc: "AI built around your workflows and brand voice." },
      { title: "Secure & scalable", desc: "Enterprise-ready with clear data handling." },
      { title: "Ongoing improvement", desc: "We iterate based on usage and feedback." },
    ],
  },
  {
    id: "ebook",
    slug: "ebook",
    title: "Ebook Design & Publishing",
    shortDesc: "Professional ebook layout, cover design, and distribution for Kindle, Apple Books, and other platforms.",
    longDesc: "From manuscript to storefront — we handle ebook design, formatting, and distribution so your book looks and sells like a pro. We create responsive layouts, eye-catching covers, and metadata that ranks. Whether you're an author or a publisher, we get your ebook live on Kindle, Apple Books, Kobo, and more.",
    icon: BookOpen,
    image: "/new-services/ebook-card.png",
    bannerImage: "/new-services/ebook.png",
    features: ["Interior layout & typography", "Cover design", "EPUB & Kindle formatting", "Multi-platform distribution", "Metadata & SEO for books"],
    highlights: [
      { title: "Reader-first design", desc: "Layouts that work on every device and font size." },
      { title: "Store-ready", desc: "Compliant with Kindle, Apple, and other retailers." },
      { title: "Fast turnaround", desc: "Clear timelines from draft to publication." },
    ],
  },
  {
    id: "youtube-content",
    slug: "youtube-content",
    title: "YouTube Content",
    shortDesc: "Scripts, thumbnails, editing, and full channel strategy to grow your audience and engagement.",
    longDesc: "We help creators and brands grow on YouTube with end-to-end content production. From scripting and filming guidance to editing, thumbnails, and SEO, we make videos that get views and keep audiences coming back. We also build channel strategy, upload schedules, and analytics so you can scale with confidence.",
    icon: Youtube,
    image: "/new-services/youtube-card.png",
    bannerImage: "/new-services/youtube.png",
    features: ["Scriptwriting & storyboarding", "Video editing & post-production", "Thumbnail design", "SEO & metadata", "Channel strategy & analytics"],
    highlights: [
      { title: "Watch-time focused", desc: "Content structured to retain and convert." },
      { title: "On-brand", desc: "Consistent look and voice across your channel." },
      { title: "Data-driven", desc: "Decisions based on performance and trends." },
    ],
  },
  {
    id: "magazine",
    slug: "magazine",
    title: "Digital Magazine",
    shortDesc: "Stunning digital magazine design and interactive layouts for brands and publishers.",
    longDesc: "We design and build digital magazines that readers love. From editorial layouts and interactive elements to subscription and reading experiences on web and app, we create publications that stand out. Perfect for brands, publishers, and anyone turning content into a polished digital product.",
    icon: BookMarked,
    image: "/new-services/magazine-card.png",
    bannerImage: "/new-services/magazine.png",
    features: ["Editorial layout design", "Interactive elements", "Web & app publishing", "Subscription flows", "Analytics & engagement"],
    highlights: [
      { title: "Editorial quality", desc: "Layouts that feel premium and easy to read." },
      { title: "Engaging", desc: "Interactivity that keeps readers scrolling." },
      { title: "Monetization-ready", desc: "Paywalls and memberships built in." },
    ],
  },
  {
    id: "e-newspaper",
    slug: "e-newspaper",
    title: "E-Newspaper",
    shortDesc: "Digital newspaper and news portal design with responsive layouts and easy content updates.",
    longDesc: "We build digital newspapers and news portals that put your stories front and center. Responsive layouts, fast loading, and simple CMS integration mean your team can publish and update without technical hassle. We focus on readability, accessibility, and a experience that works on every device.",
    icon: Newspaper,
    image: "/new-services/e-newspaper-card.png",
    bannerImage: "/new-services/e-newspaper.png",
    features: ["Responsive news layout", "CMS integration", "Fast loading & SEO", "Breaking news & sections", "Ads & sponsorship slots"],
    highlights: [
      { title: "Reader-friendly", desc: "Clear hierarchy and typography for long reading." },
      { title: "Easy to update", desc: "Non-developers can publish and manage content." },
      { title: "Revenue-ready", desc: "Ad units and subscription options included." },
    ],
  },
  {
    id: "podcast",
    slug: "podcast",
    title: "Podcast Production",
    shortDesc: "Recording, editing, show notes, and distribution for podcasts that sound professional.",
    longDesc: "We take your podcast from idea to ear. Our team handles recording setup, editing, mixing, show notes, and distribution so you can focus on the conversation. We deliver broadcast-quality audio and consistent branding so your show sounds as good as it sounds in your head.",
    icon: Mic2,
    image: "/new-services/podcast-card.png",
    bannerImage: "/new-services/podcast.png",
    features: ["Recording & editing", "Mixing & mastering", "Show notes & transcripts", "Artwork & branding", "Distribution & RSS"],
    highlights: [
      { title: "Broadcast quality", desc: "Clean audio that sounds professional." },
      { title: "Turnkey", desc: "We handle the full pipeline so you don't have to." },
      { title: "Consistent brand", desc: "Artwork and notes that match your show." },
    ],
  },
  {
    id: "infographics",
    slug: "infographics",
    title: "Infographics & Data Viz",
    shortDesc: "Clear, engaging infographics and data visualizations that make complex info easy to share.",
    longDesc: "We turn data and ideas into visuals that get shared. From static infographics to interactive dashboards and reports, we make complex information clear and engaging. Ideal for reports, presentations, social content, and internal communications that need to stick.",
    icon: BarChart3,
    image: "/new-services/infographics-card.png",
    bannerImage: "/new-services/infographics.png",
    features: ["Static infographics", "Interactive data viz", "Reports & presentations", "Social-ready formats", "Brand-aligned design"],
    highlights: [
      { title: "Clarity first", desc: "Design that makes the message obvious." },
      { title: "Shareable", desc: "Formats that work on social and in decks." },
      { title: "Accurate", desc: "Data viz that respects the numbers." },
    ],
  },
  {
    id: "chatbot",
    slug: "chatbot",
    title: "Chatbot Development",
    shortDesc: "Custom chatbots for support, sales, and engagement — integrated with your existing tools.",
    longDesc: "We build chatbots that actually help. Whether for customer support, lead qualification, or internal workflows, our bots are designed around your processes and integrated with your CRM, helpdesk, and apps. We use proven AI and conversation design so users get answers fast and your team gets relief.",
    icon: MessageCircle,
    image: "/new-services/chatbot-card.png",
    bannerImage: "/new-services/chatbot.png",
    features: ["Conversation design", "CRM & helpdesk integration", "Multi-channel (web, WhatsApp, etc.)", "Analytics & training", "Handoff to humans"],
    highlights: [
      { title: "Fits your stack", desc: "Works with the tools you already use." },
      { title: "Human handoff", desc: "Smooth escalation when the bot can't help." },
      { title: "Improves over time", desc: "We tune based on real conversations." },
    ],
  },
  {
    id: "copywriting",
    slug: "copywriting",
    title: "Copywriting & Content",
    shortDesc: "SEO-friendly copy, blog posts, and marketing content that converts and ranks.",
    longDesc: "We write copy that converts and content that ranks. From landing pages and product copy to blog series and SEO content, we match your voice and goals. Every piece is built for clarity, persuasion, and search — so you get both traffic and conversions.",
    icon: PenLine,
    image: "/new-services/copywriting-card.png",
    bannerImage: "/new-services/copywriting.png",
    features: ["Landing pages & product copy", "Blog & SEO content", "Email sequences", "Ad copy & social", "Content strategy"],
    highlights: [
      { title: "On-brand voice", desc: "Copy that sounds like you and your audience." },
      { title: "SEO built-in", desc: "Content structured for search and sharing." },
      { title: "Conversion-focused", desc: "Every word chosen to move the needle." },
    ],
  },
  {
    id: "social-content",
    slug: "social-content",
    title: "Social Media Content",
    shortDesc: "Reels, stories, carousels, and campaigns tailored for Instagram, LinkedIn, and TikTok.",
    longDesc: "We create social content that gets seen and shared. From Reels and Stories to carousels and campaigns, we produce on-brand content for Instagram, LinkedIn, TikTok, and more. We combine creative direction with platform best practices so your feed looks professional and your metrics move.",
    icon: Megaphone,
    image: "/new-services/social-content-card.png",
    bannerImage: "/new-services/social-content.png",
    features: ["Reels, Stories & short-form", "Carousels & static posts", "Campaign concepts", "Copy & hashtags", "Content calendars"],
    highlights: [
      { title: "Platform-native", desc: "Formats and trends that work on each channel." },
      { title: "Consistent look", desc: "Templates and style guides for your brand." },
      { title: "Ready to post", desc: "Final assets and captions delivered on schedule." },
    ],
  },
];

export function getNewServiceBySlug(slug: string): NewServiceItem | undefined {
  return newServicesData.find((s) => s.slug === slug);
}

export function getAllNewServiceSlugs(): string[] {
  return newServicesData.map((s) => s.slug);
}
