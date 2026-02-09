import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/auth-context";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import CitizenDashboard from "./pages/CitizenDashboard";
import ReportEmergency from "./pages/ReportEmergency";
import SubmissionSuccess from "./pages/SubmissionSuccess";
import TrackingPage from "./pages/TrackingPage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

import { LanguageProvider } from "@/lib/language-context";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
    <LanguageProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/home" element={<CitizenDashboard />} />
                <Route path="/report" element={<ReportEmergency />} />
                <Route path="/submitted" element={<SubmissionSuccess />} />
                <Route path="/track/:id" element={<TrackingPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </LanguageProvider>
  </ThemeProvider>
);

export default App;
