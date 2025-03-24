
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LazyMotion, domAnimation } from "framer-motion";

// Pages
import Index from "./pages/Index";
import Patients from "./pages/Patients";
import PatientDetail from "./pages/PatientDetail";
import PatientRegistration from "./pages/PatientRegistration";
import ReportGenerator from "./pages/ReportGenerator";
import SharedReport from "./pages/SharedReport";
import SessionScheduler from "./pages/SessionScheduler";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import PatientLinks from "./pages/PatientLinks";
import Admin from "./pages/Admin";

// New pages
import InitialEvaluation from "./pages/evaluations/InitialEvaluation";
import SessionEvaluation from "./pages/evaluations/SessionEvaluation";
import SessionSummary from "./pages/sessions/SessionSummary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LazyMotion features={domAnimation}>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/patients/:id" element={<PatientDetail />} />
            <Route path="/patients/new" element={<PatientRegistration />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/sessions" element={<SessionScheduler />} />
            <Route path="/sessions/:id" element={<NotFound />} />
            <Route path="/sessions/new" element={<SessionScheduler />} />
            <Route path="/reports" element={<ReportGenerator />} />
            <Route path="/reports/shared/:reportId" element={<SharedReport />} />
            <Route path="/patient-links/:patientId" element={<PatientLinks />} />
            <Route path="/admin" element={<Admin />} />
            
            {/* New routes */}
            <Route path="/patients/:id/initial-evaluation" element={<InitialEvaluation />} />
            <Route path="/patients/:patientId/sessions/:sessionId/evaluation" element={<SessionEvaluation />} />
            <Route path="/patients/:patientId/sessions/:sessionId/summary" element={<SessionSummary />} />
            <Route path="/patients/:patientId/sessions/evaluation" element={<SessionEvaluation />} />
            <Route path="/patients/:patientId/sessions/summary" element={<SessionSummary />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LazyMotion>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
