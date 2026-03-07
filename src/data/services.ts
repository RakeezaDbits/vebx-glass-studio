import {
  Smartphone,
  Globe,
  Code2,
  Palette,
  TrendingUp,
  Film,
  Box,
  Glasses,
  Gamepad2,
  Share2,
  Monitor,
  LucideIcon,
} from "lucide-react";

export interface ServiceItem {
  slug: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  icon: LucideIcon;
  features: string[];
  highlights: { title: string; desc: string }[];
}

export const servicesData: ServiceItem[] = [
  {
    slug: "mobile-application",
    title: "Mobile Application",
    shortDesc: "Native & cross-platform apps that captivate users",
    longDesc: "We build mobile applications that users love. From native iOS and Android to cross-platform solutions with React Native and Flutter, we deliver performant, scalable apps that align with your business goals. Our team handles everything from UX design to App Store deployment.",
    icon: Smartphone,
    features: ["iOS & Android native development", "React Native & Flutter", "UI/UX design", "App Store & Play Store deployment", "Maintenance & updates"],
    highlights: [
      { title: "Cross-platform", desc: "One codebase for iOS and Android when it makes sense." },
      { title: "Performance", desc: "Optimized for speed, battery, and offline capability." },
      { title: "Security", desc: "Best practices for data and compliance (GDPR, HIPAA)." },
    ],
  },
  {
    slug: "web-cms-development",
    title: "Web CMS Development",
    shortDesc: "Powerful content management solutions",
    longDesc: "Custom web platforms and content management systems that put you in control. We build with WordPress, headless CMS, and custom backends so your team can publish and manage content without depending on developers for every update.",
    icon: Globe,
    features: ["WordPress & headless CMS", "Custom admin panels", "API-first architecture", "Multi-site & multilingual", "SEO-friendly structure"],
    highlights: [
      { title: "Easy content updates", desc: "Intuitive dashboards for non-technical teams." },
      { title: "Scalable", desc: "Architected to grow with your traffic and content." },
      { title: "Integrations", desc: "Connect to CRM, analytics, and marketing tools." },
    ],
  },
  {
    slug: "software-development",
    title: "Software Development",
    shortDesc: "Custom software tailored to your needs",
    longDesc: "From SaaS products to enterprise systems, we build custom software that fits your workflows. We use modern stacks and agile delivery so you get a solution that scales and evolves with your business.",
    icon: Code2,
    features: ["SaaS & web applications", "Enterprise systems", "APIs & integrations", "Cloud deployment (AWS, Azure, GCP)", "Agile delivery"],
    highlights: [
      { title: "Custom-built", desc: "No off-the-shelf compromise — built for your needs." },
      { title: "Modern stack", desc: "React, Node, Python, .NET, and proven technologies." },
      { title: "Ongoing support", desc: "Maintenance, updates, and feature evolution." },
    ],
  },
  {
    slug: "corporate-branding",
    title: "Corporate Branding",
    shortDesc: "Bold brand identities that stand out",
    longDesc: "We create brand identities that communicate who you are and resonate with your audience. From logo design and visual guidelines to full brand strategy, we help you stand out in your market.",
    icon: Palette,
    features: ["Logo & visual identity", "Brand guidelines", "Brand strategy", "Collateral design", "Digital asset kits"],
    highlights: [
      { title: "Distinct identity", desc: "Memorable logos and consistent visual language." },
      { title: "Strategy-led", desc: "Brand choices tied to your business and audience." },
      { title: "Ready to use", desc: "Assets and guidelines for all touchpoints." },
    ],
  },
  {
    slug: "online-digital-marketing",
    title: "Online Digital Marketing",
    shortDesc: "Data-driven strategies for growth",
    longDesc: "Grow your reach and conversions with SEO, PPC, content marketing, and conversion optimization. We focus on measurable results and sustainable growth, not vanity metrics.",
    icon: TrendingUp,
    features: ["SEO & content strategy", "PPC & paid social", "Conversion optimization", "Analytics & reporting", "Marketing automation"],
    highlights: [
      { title: "Data-driven", desc: "Decisions based on analytics and testing." },
      { title: "Full-funnel", desc: "Awareness, consideration, and conversion campaigns." },
      { title: "Transparent reporting", desc: "Clear metrics and regular reviews." },
    ],
  },
  {
    slug: "2d-3d-animation",
    title: "2D/3D & Animation",
    shortDesc: "Stunning visuals that tell your story",
    longDesc: "Motion graphics, explainer videos, and cinematic animations that engage and explain. We produce 2D and 3D content for ads, product demos, and brand storytelling across all platforms.",
    icon: Film,
    features: ["Motion graphics", "Explainer videos", "2D & 3D animation", "Character animation", "Social & ad content"],
    highlights: [
      { title: "Story-first", desc: "Every frame supports your message and brand." },
      { title: "Multi-format", desc: "From short social clips to long-form explainers." },
      { title: "On-brand", desc: "Consistent style with your visual identity." },
    ],
  },
  {
    slug: "3d-rendering-services",
    title: "3D Rendering Services",
    shortDesc: "Photorealistic 3D visualizations",
    longDesc: "High-quality 3D renders for architecture, product visualization, and marketing. We deliver photorealistic imagery and animations that showcase your products and spaces before they exist in the real world.",
    icon: Box,
    features: ["Architectural visualization", "Product rendering", "CGI for marketing", "Interior & exterior", "Animation & walkthroughs"],
    highlights: [
      { title: "Photorealistic", desc: "Lighting and materials that look real." },
      { title: "Any industry", desc: "Real estate, retail, automotive, and more." },
      { title: "Fast iterations", desc: "Quick changes without physical reshoots." },
    ],
  },
  {
    slug: "metaverse-development",
    title: "Metaverse Development",
    shortDesc: "Next-gen immersive digital worlds",
    longDesc: "We design and build metaverse experiences: virtual spaces, digital twins, and immersive environments for events, retail, and community. From concept to deployment on leading platforms.",
    icon: Monitor,
    features: ["Virtual spaces & worlds", "Digital twins", "VR/AR integration", "Multi-user experiences", "Web3-ready experiences"],
    highlights: [
      { title: "Immersive", desc: "Spaces that feel real and engaging." },
      { title: "Scalable", desc: "Architecture that supports many concurrent users." },
      { title: "Brand-ready", desc: "Custom environments that reflect your brand." },
    ],
  },
  {
    slug: "game-development",
    title: "Game Development",
    shortDesc: "Engaging games across all platforms",
    longDesc: "From mobile games to PC and console, we build games that players love. We use Unity and Unreal Engine to create original IP, serious games, and branded experiences with a focus on gameplay and polish.",
    icon: Gamepad2,
    features: ["Mobile, PC & console", "Unity & Unreal Engine", "Game design & mechanics", "Multiplayer & live ops", "Porting & optimization"],
    highlights: [
      { title: "Full production", desc: "Design, art, code, and launch support." },
      { title: "Proven engines", desc: "Unity and Unreal for quality and performance." },
      { title: "Post-launch", desc: "Updates, events, and community features." },
    ],
  },
  {
    slug: "extended-reality",
    title: "Extended Reality",
    shortDesc: "AR/VR/MR experiences that transform",
    longDesc: "AR, VR, and mixed reality experiences for training, marketing, and product visualization. We build apps that run on headsets and mobile devices to train employees, showcase products, or create immersive campaigns.",
    icon: Glasses,
    features: ["AR apps (mobile & glasses)", "VR training & simulations", "Mixed reality experiences", "Virtual tours", "Hardware-agnostic design"],
    highlights: [
      { title: "Practical use cases", desc: "Training, sales, and marketing that drive ROI." },
      { title: "Multi-device", desc: "Works on phones, tablets, and XR headsets." },
      { title: "User-tested", desc: "Comfort and usability at the core." },
    ],
  },
  {
    slug: "social-media-marketing",
    title: "Social Media Marketing",
    shortDesc: "Strategic social presence & engagement",
    longDesc: "We build and manage your social presence with strategy, content, and community management. From organic content to influencer partnerships and paid social, we help you connect with the right audience.",
    icon: Share2,
    features: ["Content strategy & creation", "Community management", "Influencer partnerships", "Paid social campaigns", "Analytics & reporting"],
    highlights: [
      { title: "Brand voice", desc: "Content that sounds like you and resonates." },
      { title: "Community", desc: "Engagement that builds loyalty and advocacy." },
      { title: "Paid + organic", desc: "Integrated approach for maximum reach." },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return servicesData.find((s) => s.slug === slug);
}

export function getAllServiceSlugs(): string[] {
  return servicesData.map((s) => s.slug);
}
