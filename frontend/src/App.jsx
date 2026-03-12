import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'

// Public pages
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import ServiceDetailPage from './pages/ServiceDetailPage'
import AboutPage from './pages/AboutPage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import ContactPage from './pages/ContactPage'
import AppointmentPage from './pages/AppointmentPage'
import LoginPage from './pages/LoginPage'

// Protected (dashboard)
import DashboardLayout from './layouts/DashboardLayout'
import DashboardHome from './pages/dashboard/DashboardHome'
import CalendarPage from './pages/dashboard/CalendarPage'
import PatientsPage from './pages/dashboard/PatientsPage'
import PatientDetailPage from './pages/dashboard/PatientDetailPage'
import SessionNotesPage from './pages/dashboard/SessionNotesPage'
import BlogAdminPage from './pages/dashboard/BlogAdminPage'
import MediaPage from './pages/dashboard/MediaPage'
import AppointmentsAdminPage from './pages/dashboard/AppointmentsAdminPage'

import PublicLayout from './layouts/PublicLayout'
import './styles/globals.css'

const queryClient = new QueryClient()

function ProtectedRoute({ children }) {
  const token = useAuthStore(s => s.token)
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'DM Sans' } }} />
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/servicos" element={<ServicesPage />} />
            <Route path="/servicos/:slug" element={<ServiceDetailPage />} />
            <Route path="/sobre" element={<AboutPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/marcacao" element={<AppointmentPage />} />
          </Route>

          {/* Auth */}
          <Route path="/login" element={<LoginPage />} />

          {/* Dashboard */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<DashboardHome />} />
            <Route path="calendario" element={<CalendarPage />} />
            <Route path="pacientes" element={<PatientsPage />} />
            <Route path="pacientes/:id" element={<PatientDetailPage />} />
            <Route path="sumarios" element={<SessionNotesPage />} />
            <Route path="marcacoes" element={<AppointmentsAdminPage />} />
            <Route path="blog" element={<BlogAdminPage />} />
            <Route path="media" element={<MediaPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
