import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PathProvider } from "@/contexts/PathContext";
import Index from "./pages/Index.tsx";
import Flow from "./pages/Flow.tsx";
import Legado from "./pages/Legado.tsx";
import Profile from "./pages/Profile.tsx";
import Study from "./pages/Study.tsx";
import VIP from "./pages/VIP.tsx";
import Community from "./pages/Community.tsx";
import NotFound from "./pages/NotFound.tsx";
import Admin from "./pages/Admin.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PathProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/flow" element={<Flow />} />
            <Route path="/legado" element={<Legado />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/study" element={<Study />} />
            <Route path="/vip" element={<VIP />} />
            <Route path="/community" element={<Community />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PathProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
