import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import NewServiceDetail from "./pages/NewServiceDetail";
import Pricing from "./pages/Pricing";
import OurWork from "./pages/OurWork";
import Expertise from "./pages/Expertise";
import Contact from "./pages/Contact";
import CustomRequirement from "./pages/CustomRequirement";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import DesignAssistant from "./pages/DesignAssistant";
import NotFound from "./pages/NotFound";
import AdminGuard from "./components/AdminGuard";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminQuotes from "./pages/admin/AdminQuotes";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminServices from "./pages/admin/AdminServices";
import AdminExpertise from "./pages/admin/AdminExpertise";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminLiveChat from "./pages/admin/AdminLiveChat";
import ScrollToTop from "./components/ScrollToTop";
import Preloader from "./components/Preloader";
import GlobalPageDecor from "./components/GlobalPageDecor";
import CursorSnake from "./components/CursorSnake";
import LiveChatWidget from "./components/LiveChatWidget";

const queryClient = new QueryClient();

function LiveChatGate() {
  const loc = useLocation();
  if (loc.pathname.startsWith("/admin") || loc.pathname === "/contact") return null;
  return <LiveChatWidget />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GlobalPageDecor />
      <div className="relative z-[1]">
        <CursorSnake />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Preloader />
          <ScrollToTop />
          <LiveChatGate />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/new-services" element={<Navigate to="/services#new-services" replace />} />
            <Route path="/new-services/:slug" element={<NewServiceDetail />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/our-work" element={<OurWork />} />
            <Route path="/expertise" element={<Expertise />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/custom-requirement" element={<CustomRequirement />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/design-assistant" element={<DesignAssistant />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="quotes" element={<AdminQuotes />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="expertise" element={<AdminExpertise />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="live-chat" element={<AdminLiveChat />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
