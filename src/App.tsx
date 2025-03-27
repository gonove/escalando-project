import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LazyMotion, domAnimation } from "framer-motion";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";

// Pages
import Index from "./pages/Index";
import Patients from "./pages/Patients";
import PatientDetail from "./pages/PatientDetail";
import PatientRegistration from "./pages/PatientRegistration";
import PatientEdit from "./pages/PatientEdit";
import ReportGenerator from "./pages/ReportGenerator";
import SharedReport from "./pages/SharedReport";
import SessionScheduler from "./pages/SessionScheduler";
import SessionBilling from "./pages/SessionBilling";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import PatientLinks from "./pages/PatientLinks";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";

// New pages
import InitialEvaluation from "./pages/evaluations/InitialEvaluation";
import SessionEvaluation from "./pages/evaluations/SessionEvaluation";
import SessionSummary from "./pages/sessions/SessionSummary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <LazyMotion features={domAnimation}>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/reset-password" element={<Auth />} />
              
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
              <Route path="/patients/:id" element={<ProtectedRoute><PatientDetail /></ProtectedRoute>} />
              <Route path="/patients/new" element={<ProtectedRoute><PatientRegistration /></ProtectedRoute>} />
              <Route path="/patients/:id/edit" element={<ProtectedRoute><PatientEdit /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/sessions" element={<ProtectedRoute><SessionScheduler /></ProtectedRoute>} />
              <Route path="/billing" element={<ProtectedRoute><SessionBilling /></ProtectedRoute>} />
              <Route path="/sessions/:id" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />
              <Route path="/sessions/new" element={<ProtectedRoute><SessionScheduler /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><ReportGenerator /></ProtectedRoute>} />
              <Route path="/reports/shared/:reportId" element={<SharedReport />} />
              <Route path="/patient-links/:patientId" element={<ProtectedRoute><PatientLinks /></ProtectedRoute>} />
              <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
              
              <Route path="/patients/:id/initial-evaluation" element={<ProtectedRoute><InitialEvaluation /></ProtectedRoute>} />
              <Route path="/patients/:patientId/sessions/:sessionId/evaluation" element={<ProtectedRoute><SessionEvaluation /></ProtectedRoute>} />
              <Route path="/patients/:patientId/sessions/:sessionId/summary" element={<ProtectedRoute><SessionSummary /></ProtectedRoute>} />
              <Route path="/patients/:patientId/sessions/evaluation" element={<ProtectedRoute><SessionEvaluation /></ProtectedRoute>} />
              <Route path="/patients/:patientId/sessions/summary" element={<ProtectedRoute><SessionSummary /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LazyMotion>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
