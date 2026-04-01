import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { PathProvider } from "@/contexts/PathContext";
import Auth from "./pages/Auth.tsx";
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

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
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
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
