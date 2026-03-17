import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'
import ParentLayout from './layouts/ParentLayout'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import ServiceDetailPage from './pages/ServiceDetailPage'
import AboutPage from './pages/AboutPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import ContactPage from './pages/ContactPage'
import AppointmentPage from './pages/AppointmentPage'
import PrivacyPage from './pages/PrivacyPage'
import FAQPage from './pages/FAQPage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import DashboardHome from './pages/dashboard/DashboardHome'
import CalendarPage from './pages/dashboard/CalendarPage'
import PatientsPage from './pages/dashboard/PatientsPage'
import SessionNotesPage from './pages/dashboard/SessionNotesPage'
import RequestsPage from './pages/dashboard/RequestsPage'
import TeamPage from './pages/dashboard/TeamPage'
import ParentHome from './pages/parent/ParentHome'
import useSEO from './hooks/useSEO'

function SEOWrapper() {
  useSEO()
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <SEOWrapper />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/servicos" element={<ServicesPage />} />
          <Route path="/servicos/:slug" element={<ServiceDetailPage />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/marcacao" element={<AppointmentPage />} />
          <Route path="/privacidade" element={<PrivacyPage />} />
          <Route path="/faq" element={<FAQPage />} />
        </Route>

        <Route element={
          <ProtectedRoute roles={['admin', 'therapist']}>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/calendario" element={<CalendarPage />} />
          <Route path="/dashboard/pacientes" element={<PatientsPage />} />
          <Route path="/dashboard/notas" element={<SessionNotesPage />} />
          <Route path="/dashboard/pedidos" element={<RequestsPage />} />
          <Route path="/dashboard/equipa" element={<TeamPage />} />
        </Route>

        <Route element={
          <ProtectedRoute roles={['parent']}>
            <ParentLayout />
          </ProtectedRoute>
        }>
          <Route path="/familia" element={<ParentHome />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
