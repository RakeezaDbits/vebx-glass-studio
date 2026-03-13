import "dotenv/config";
import mysql from "mysql2/promise";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const projects = [
  { slug: "emaanai", title: "Emaan Ai", category: "Mobile Application", description: "Islamic app for Android and iOS with a green-branded experience, prayer times, Quran, and an analytics dashboard for engagement insights.", image_url: "/our-work/emaanai.png", sort_order: 1 },
  { slug: "vebxcode", title: "Vebxcode", category: "Web Application", description: "Full portfolio website for a digital agency — dark theme, red accents, services, project gallery, achievements, blog, and contact. Built to showcase their work and expertise.", image_url: "/our-work/vebxcode.png", sort_order: 2 },
  { slug: "healthsync", title: "HealthSync", category: "Healthcare", description: "Doctor-patient portal for appointments, prescriptions, and medical records. HIPAA-aligned, used by clinics for scheduling and follow-ups.", image_url: "/our-work/healthsync.png", sort_order: 3 },
  { slug: "taskflow", title: "TaskFlow", category: "SaaS", description: "Team task management with Kanban boards, deadlines, and real-time sync. Deployed for remote teams and agencies.", image_url: "/our-work/taskflow.png", sort_order: 4 },
  { slug: "fooddash", title: "FoodDash", category: "Mobile Application", description: "Restaurant discovery, online ordering, and live delivery tracking. Partner app for restaurants and driver app for logistics.", image_url: "/our-work/fooddash.png", sort_order: 5 },
  { slug: "eventify", title: "Eventify", category: "Web Application", description: "Event ticketing and venue booking platform with payment, attendee management, and QR check-in. Used for conferences and workshops.", image_url: "/our-work/eventify.png", sort_order: 6 },
  { slug: "docvault", title: "DocVault", category: "Software", description: "Secure document storage with e-sign, version history, and compliance controls. Built for legal and finance teams.", image_url: "/our-work/docvault.png", sort_order: 7 },
  { slug: "fittrack", title: "FitTrack", category: "Mobile Application", description: "Fitness and health tracking app with workout plans, progress dashboards, and nutrition logging. Cross-platform for Android and iOS.", image_url: "/our-work/fittrack.png", sort_order: 8 },
  { slug: "cloudflow", title: "CloudFlow", category: "SaaS", description: "Project management and workflow SaaS platform with real-time collaboration, task boards, and team analytics for remote teams.", image_url: "/our-work/cloudflow.png", sort_order: 9 },
  { slug: "neondrift", title: "Neon Drift", category: "Game Development", description: "Arcade-style racing game with neon aesthetics, smooth controls, and leaderboards. Built with Unity for multiple platforms.", image_url: "/our-work/neondrift.png", sort_order: 10 },
  { slug: "shopverse", title: "ShopVerse", category: "E-Commerce", description: "Modern e-commerce platform with product catalog, cart, checkout, and vendor dashboard. Integrated payments and inventory.", image_url: "/our-work/shopverse.png", sort_order: 11 },
  { slug: "paybridge", title: "PayBridge", category: "FinTech", description: "Payment and finance dashboard for businesses — transactions, reconciliation, and reporting with bank-grade security.", image_url: "/our-work/paybridge.png", sort_order: 12 },
  { slug: "learnhub", title: "LearnHub", category: "EdTech", description: "Learning management platform with courses, progress tracking, quizzes, and certificates for educators and learners.", image_url: "/our-work/learnhub.png", sort_order: 13 },
  { slug: "smartops", title: "SmartOps", category: "Software & IoT", description: "IoT-powered operations dashboard for monitoring assets, alerts, and analytics. Built for smart facilities and logistics.", image_url: "/our-work/smartops.png", sort_order: 14 },
  { slug: "engagelab", title: "EngageLab", category: "Digital Marketing", description: "Social media and campaign analytics platform — engagement metrics, content scheduling, and ROI reporting for brands.", image_url: "/our-work/engagelab.png", sort_order: 15 },
];

const services = [
  { slug: "mobile-application", title: "Mobile Application", short_desc: "Native & cross-platform apps that captivate users", long_desc: "We build mobile applications that users love. From native iOS and Android to cross-platform solutions with React Native and Flutter, we deliver performant, scalable apps that align with your business goals. Our team handles everything from UX design to App Store deployment.", icon_name: "Smartphone", features: ["iOS & Android native development", "React Native & Flutter", "UI/UX design", "App Store & Play Store deployment", "Maintenance & updates"], highlights: [{ title: "Cross-platform", desc: "One codebase for iOS and Android when it makes sense." }, { title: "Performance", desc: "Optimized for speed, battery, and offline capability." }, { title: "Security", desc: "Best practices for data and compliance (GDPR, HIPAA)." }], sort_order: 1 },
  { slug: "web-cms-development", title: "Web CMS Development", short_desc: "Powerful content management solutions", long_desc: "Custom web platforms and content management systems that put you in control. We build with WordPress, headless CMS, and custom backends so your team can publish and manage content without depending on developers for every update.", icon_name: "Globe", features: ["WordPress & headless CMS", "Custom admin panels", "API-first architecture", "Multi-site & multilingual", "SEO-friendly structure"], highlights: [{ title: "Easy content updates", desc: "Intuitive dashboards for non-technical teams." }, { title: "Scalable", desc: "Architected to grow with your traffic and content." }, { title: "Integrations", desc: "Connect to CRM, analytics, and marketing tools." }], sort_order: 2 },
  { slug: "software-development", title: "Software Development", short_desc: "Custom software tailored to your needs", long_desc: "From SaaS products to enterprise systems, we build custom software that fits your workflows. We use modern stacks and agile delivery so you get a solution that scales and evolves with your business.", icon_name: "Code2", features: ["SaaS & web applications", "Enterprise systems", "APIs & integrations", "Cloud deployment (AWS, Azure, GCP)", "Agile delivery"], highlights: [{ title: "Custom-built", desc: "No off-the-shelf compromise — built for your needs." }, { title: "Modern stack", desc: "React, Node, Python, .NET, and proven technologies." }, { title: "Ongoing support", desc: "Maintenance, updates, and feature evolution." }], sort_order: 3 },
  { slug: "corporate-branding", title: "Corporate Branding", short_desc: "Bold brand identities that stand out", long_desc: "We create brand identities that communicate who you are and resonate with your audience. From logo design and visual guidelines to full brand strategy, we help you stand out in your market.", icon_name: "Palette", features: ["Logo & visual identity", "Brand guidelines", "Brand strategy", "Collateral design", "Digital asset kits"], highlights: [{ title: "Distinct identity", desc: "Memorable logos and consistent visual language." }, { title: "Strategy-led", desc: "Brand choices tied to your business and audience." }, { title: "Ready to use", desc: "Assets and guidelines for all touchpoints." }], sort_order: 4 },
  { slug: "online-digital-marketing", title: "Online Digital Marketing", short_desc: "Data-driven strategies for growth", long_desc: "Grow your reach and conversions with SEO, PPC, content marketing, and conversion optimization. We focus on measurable results and sustainable growth, not vanity metrics.", icon_name: "TrendingUp", features: ["SEO & content strategy", "PPC & paid social", "Conversion optimization", "Analytics & reporting", "Marketing automation"], highlights: [{ title: "Data-driven", desc: "Decisions based on analytics and testing." }, { title: "Full-funnel", desc: "Awareness, consideration, and conversion campaigns." }, { title: "Transparent reporting", desc: "Clear metrics and regular reviews." }], sort_order: 5 },
  { slug: "2d-3d-animation", title: "2D/3D & Animation", short_desc: "Stunning visuals that tell your story", long_desc: "Motion graphics, explainer videos, and cinematic animations that engage and explain. We produce 2D and 3D content for ads, product demos, and brand storytelling across all platforms.", icon_name: "Film", features: ["Motion graphics", "Explainer videos", "2D & 3D animation", "Character animation", "Social & ad content"], highlights: [{ title: "Story-first", desc: "Every frame supports your message and brand." }, { title: "Multi-format", desc: "From short social clips to long-form explainers." }, { title: "On-brand", desc: "Consistent style with your visual identity." }], sort_order: 6 },
  { slug: "3d-rendering-services", title: "3D Rendering Services", short_desc: "Photorealistic 3D visualizations", long_desc: "High-quality 3D renders for architecture, product visualization, and marketing. We deliver photorealistic imagery and animations that showcase your products and spaces before they exist in the real world.", icon_name: "Box", features: ["Architectural visualization", "Product rendering", "CGI for marketing", "Interior & exterior", "Animation & walkthroughs"], highlights: [{ title: "Photorealistic", desc: "Lighting and materials that look real." }, { title: "Any industry", desc: "Real estate, retail, automotive, and more." }, { title: "Fast iterations", desc: "Quick changes without physical reshoots." }], sort_order: 7 },
  { slug: "metaverse-development", title: "Metaverse Development", short_desc: "Next-gen immersive digital worlds", long_desc: "We design and build metaverse experiences: virtual spaces, digital twins, and immersive environments for events, retail, and community. From concept to deployment on leading platforms.", icon_name: "Monitor", features: ["Virtual spaces & worlds", "Digital twins", "VR/AR integration", "Multi-user experiences", "Web3-ready experiences"], highlights: [{ title: "Immersive", desc: "Spaces that feel real and engaging." }, { title: "Scalable", desc: "Architecture that supports many concurrent users." }, { title: "Brand-ready", desc: "Custom environments that reflect your brand." }], sort_order: 8 },
  { slug: "game-development", title: "Game Development", short_desc: "Engaging games across all platforms", long_desc: "From mobile games to PC and console, we build games that players love. We use Unity and Unreal Engine to create original IP, serious games, and branded experiences with a focus on gameplay and polish.", icon_name: "Gamepad2", features: ["Mobile, PC & console", "Unity & Unreal Engine", "Game design & mechanics", "Multiplayer & live ops", "Porting & optimization"], highlights: [{ title: "Full production", desc: "Design, art, code, and launch support." }, { title: "Proven engines", desc: "Unity and Unreal for quality and performance." }, { title: "Post-launch", desc: "Updates, events, and community features." }], sort_order: 9 },
  { slug: "extended-reality", title: "Extended Reality", short_desc: "AR/VR/MR experiences that transform", long_desc: "AR, VR, and mixed reality experiences for training, marketing, and product visualization. We build apps that run on headsets and mobile devices to train employees, showcase products, or create immersive campaigns.", icon_name: "Glasses", features: ["AR apps (mobile & glasses)", "VR training & simulations", "Mixed reality experiences", "Virtual tours", "Hardware-agnostic design"], highlights: [{ title: "Practical use cases", desc: "Training, sales, and marketing that drive ROI." }, { title: "Multi-device", desc: "Works on phones, tablets, and XR headsets." }, { title: "User-tested", desc: "Comfort and usability at the core." }], sort_order: 10 },
  { slug: "social-media-marketing", title: "Social Media Marketing", short_desc: "Strategic social presence & engagement", long_desc: "We build and manage your social presence with strategy, content, and community management. From organic content to influencer partnerships and paid social, we help you connect with the right audience.", icon_name: "Share2", features: ["Content strategy & creation", "Community management", "Influencer partnerships", "Paid social campaigns", "Analytics & reporting"], highlights: [{ title: "Brand voice", desc: "Content that sounds like you and resonates." }, { title: "Community", desc: "Engagement that builds loyalty and advocacy." }, { title: "Paid + organic", desc: "Integrated approach for maximum reach." }], sort_order: 11 },
];

const expertiseRows = [
  { category: "frontend", name: "React", description: null, sort_order: 1 },
  { category: "frontend", name: "Next.js", description: null, sort_order: 2 },
  { category: "frontend", name: "Vue.js", description: null, sort_order: 3 },
  { category: "frontend", name: "Angular", description: null, sort_order: 4 },
  { category: "frontend", name: "TypeScript", description: null, sort_order: 5 },
  { category: "frontend", name: "Tailwind CSS", description: null, sort_order: 6 },
  { category: "frontend", name: "Framer Motion", description: null, sort_order: 7 },
  { category: "backend", name: "Node.js", description: null, sort_order: 10 },
  { category: "backend", name: "Python", description: null, sort_order: 11 },
  { category: "backend", name: "Django", description: null, sort_order: 12 },
  { category: "backend", name: ".NET", description: null, sort_order: 13 },
  { category: "backend", name: "Go", description: null, sort_order: 14 },
  { category: "backend", name: "GraphQL", description: null, sort_order: 15 },
  { category: "backend", name: "REST APIs", description: null, sort_order: 16 },
  { category: "mobile", name: "React Native", description: null, sort_order: 20 },
  { category: "mobile", name: "Flutter", description: null, sort_order: 21 },
  { category: "mobile", name: "Swift", description: null, sort_order: 22 },
  { category: "mobile", name: "Kotlin", description: null, sort_order: 23 },
  { category: "mobile", name: "Ionic", description: null, sort_order: 24 },
  { category: "mobile", name: "PWA", description: null, sort_order: 25 },
  { category: "cloudDevops", name: "AWS", description: null, sort_order: 30 },
  { category: "cloudDevops", name: "Azure", description: null, sort_order: 31 },
  { category: "cloudDevops", name: "GCP", description: null, sort_order: 32 },
  { category: "cloudDevops", name: "Docker", description: null, sort_order: 33 },
  { category: "cloudDevops", name: "Kubernetes", description: null, sort_order: 34 },
  { category: "cloudDevops", name: "CI/CD", description: null, sort_order: 35 },
  { category: "cloudDevops", name: "Terraform", description: null, sort_order: 36 },
  { category: "gameXR", name: "Unity", description: null, sort_order: 40 },
  { category: "gameXR", name: "Unreal Engine", description: null, sort_order: 41 },
  { category: "gameXR", name: "Three.js", description: null, sort_order: 42 },
  { category: "gameXR", name: "WebXR", description: null, sort_order: 43 },
  { category: "gameXR", name: "ARKit", description: null, sort_order: 44 },
  { category: "gameXR", name: "ARCore", description: null, sort_order: 45 },
  { category: "gameXR", name: "Blender", description: null, sort_order: 46 },
  { category: "dataAI", name: "TensorFlow", description: null, sort_order: 50 },
  { category: "dataAI", name: "PyTorch", description: null, sort_order: 51 },
  { category: "dataAI", name: "OpenAI", description: null, sort_order: 52 },
  { category: "dataAI", name: "LangChain", description: null, sort_order: 53 },
  { category: "dataAI", name: "PostgreSQL", description: null, sort_order: 54 },
  { category: "dataAI", name: "MongoDB", description: null, sort_order: 55 },
  { category: "dataAI", name: "Redis", description: null, sort_order: 56 },
  { category: "industry", name: "Healthcare & MedTech", description: null, sort_order: 60 },
  { category: "industry", name: "FinTech & Banking", description: null, sort_order: 61 },
  { category: "industry", name: "E-Commerce & Retail", description: null, sort_order: 62 },
  { category: "industry", name: "Education & EdTech", description: null, sort_order: 63 },
  { category: "industry", name: "Real Estate & PropTech", description: null, sort_order: 64 },
  { category: "industry", name: "Entertainment & Media", description: null, sort_order: 65 },
  { category: "industry", name: "Automotive", description: null, sort_order: 66 },
  { category: "industry", name: "Logistics & Supply Chain", description: null, sort_order: 67 },
];

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "vebx_studio",
  });

  try {
    for (const p of projects) {
      await conn.execute(
        "INSERT INTO projects (slug, title, category, description, image_url, sort_order) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE title=VALUES(title), category=VALUES(category), description=VALUES(description), image_url=VALUES(image_url), sort_order=VALUES(sort_order)",
        [p.slug, p.title, p.category, p.description, p.image_url, p.sort_order]
      );
    }
    console.log("Projects: " + projects.length + " seeded.");

    for (const s of services) {
      await conn.execute(
        "INSERT INTO services (slug, title, short_desc, long_desc, icon_name, features, highlights, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE title=VALUES(title), short_desc=VALUES(short_desc), long_desc=VALUES(long_desc), icon_name=VALUES(icon_name), features=VALUES(features), highlights=VALUES(highlights), sort_order=VALUES(sort_order)",
        [s.slug, s.title, s.short_desc, s.long_desc, s.icon_name, JSON.stringify(s.features), JSON.stringify(s.highlights), s.sort_order]
      );
    }
    console.log("Services: " + services.length + " seeded.");

    await conn.execute("DELETE FROM expertise");
    for (const e of expertiseRows) {
      await conn.execute(
        "INSERT INTO expertise (category, name, description, sort_order) VALUES (?, ?, ?, ?)",
        [e.category, e.name, e.description, e.sort_order]
      );
    }
    console.log("Expertise: " + expertiseRows.length + " seeded.");

    console.log("Seed done.");
  } finally {
    await conn.end();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
