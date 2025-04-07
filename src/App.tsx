
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import './App.css'
import Auth from './pages/Auth'
import Index from './pages/Index'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'
import NotFound from './pages/NotFound'
import Admin from './pages/Admin'
import PatientRegistration from './pages/PatientRegistration'
import PatientEdit from './pages/PatientEdit'
import Profile from './pages/Profile'
import Patients from './pages/Patients'
import PatientDetail from './pages/PatientDetail'
import SessionScheduler from './pages/SessionScheduler'
import InitialEvaluation from './pages/evaluations/InitialEvaluation'
import SessionEvaluation from './pages/evaluations/SessionEvaluation'
import SharedReport from './pages/SharedReport'
import ReportGenerator from './pages/ReportGenerator'
import SessionSummary from './pages/sessions/SessionSummary'
import SessionBilling from './pages/SessionBilling'
import PatientLinks from './pages/PatientLinks'
import PendingEvaluations from './pages/evaluations/PendingEvaluations'
import PostSessionView from './pages/sessions/PostSessionView'
import AuthProvider from './context/AuthProvider'

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route path="/report/:reportId" element={<SharedReport />} />

          <Route path="/" element={<ProtectedRoute />}>
            <Route index element={<Index />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/patients/new" element={<PatientRegistration />} />
            <Route path="/patients/:id" element={<PatientDetail />} />
            <Route path="/patients/:id/edit" element={<PatientEdit />} />
            <Route path="/patients/:id/initial-evaluation" element={<InitialEvaluation />} />
            <Route path="/patients/:id/links" element={<PatientLinks />} />
            <Route path="/sessions" element={<SessionScheduler />} />
            <Route path="/sessions/new" element={<SessionScheduler />} />
            <Route path="/sessions/summary/:patientId/:sessionId" element={<SessionSummary />} />
            <Route path="/sessions/post/:patientId/:sessionId" element={<PostSessionView />} />
            <Route path="/sessions/billing/:patientId/:sessionId" element={<SessionBilling />} />
            <Route path="/evaluations/pending" element={<PendingEvaluations />} />
            <Route path="/patients/:patientId/sessions/:sessionId/evaluation" element={<SessionEvaluation />} />
            <Route path="/patients/:patientId/sessions/:sessionId/summary" element={<SessionSummary />} />
            <Route path="/reports" element={<ReportGenerator />} />
            <Route path="/reports/new/:patientId" element={<ReportGenerator />} />
          </Route>

          <Route path="/admin" element={<AdminRoute />}>
            <Route index element={<Admin />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>

        <Toaster />
      </Router>
    </AuthProvider>

  )
}

export default App
