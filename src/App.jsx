
import { lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import WhatsAppWidget from './components/WhatsAppWidget'
import { legacyRoutes } from './content/routes.js'

const ClinicPage = lazy(() => import('./pages/ClinicPage'))
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const TeamDetailPage = lazy(() => import('./pages/TeamDetailPage'))
const TeamPage = lazy(() => import('./pages/TeamPage'))
const UnitsPage = lazy(() => import('./pages/UnitsPage'))
const NewsPage = lazy(() => import('./pages/NewsPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const DetailPage = lazy(() => import('./pages/DetailPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="clinica" element={<ClinicPage />} />
          <Route path="servicos" element={<ServicesPage />} />
          <Route path="servicos/:slug" element={<DetailPage kind="service" />} />
          <Route path="equipa" element={<TeamPage />} />
          <Route path="equipa/:slug" element={<TeamDetailPage />} />
          <Route path="unidades" element={<UnitsPage />} />
          <Route path="unidades/:slug" element={<UnitsPage />} />
          <Route path="novidades" element={<NewsPage />} />
          <Route path="novidades/:slug" element={<DetailPage kind="news" />} />
          <Route path="contactos" element={<ContactPage />} />
          <Route path="privacidade" element={<PrivacyPage />} />

          {Object.entries(legacyRoutes).map(([from, to]) => (
            <Route
              key={from}
              path={from}
              element={<Navigate to={to} replace />}
            />
          ))}

          <Route path="blog/:slug" element={<DetailPage kind="news" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      {/* WhatsApp visível em todas as páginas */}
      <WhatsAppWidget />
    </BrowserRouter>
  )
}
