import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CampaignInput from "./pages/CampaignInput";
import IdeaGeneration from "./pages/IdeaGeneration";
import CampaignPlan from "./pages/CampaignPlan";
import WhitePaperGenerator from "./pages/WhitePaperGenerator";
import WhitePaperPreview from "./pages/WhitePaperPreview";
import VideoStudio from "./pages/VideoStudio";
import NotFound from "./pages/NotFound";
import { PasswordGate } from "./components/PasswordGate";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PasswordGate>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/campaign/input" element={<CampaignInput />} />
          <Route path="/campaign/ideas" element={<IdeaGeneration />} />
          <Route path="/campaign/plan" element={<CampaignPlan />} />
          <Route path="/whitepaper" element={<WhitePaperGenerator />} />
          <Route path="/whitepaper/preview" element={<WhitePaperPreview />} />
          <Route path="/video-studio" element={<VideoStudio />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </PasswordGate>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
