import { useState } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Calendar, Users, FileText, LogOut, Menu, X, ChevronRight, Bell } from 'lucide-react'

const NAV = [
  { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} />, exact: true },
  { path: '/dashboard/calendario', label: 'Calendário', icon: <Calendar size={18} /> },
  { path: '/dashboard/pacientes', label: 'Pacientes', icon: <Users size={18} /> },
  { path: '/dashboard/notas', label: 'Sumários', icon: <FileText size={18} /> },
]

export default function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const isActive = (path, exact) => exact ? location.pathname === path : location.pathname.startsWith(path)

  const logout = () => navigate('/login')

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 fixed top-0 left-0 bottom-0 z-30">
        <div className="p-6 border-b border-gray-50">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-teal-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">A</span>
            </div>
            <div>
              <p className="font-display font-bold text-teal-900 text-sm">Alcançari</p>
              <p className="text-gray-400 text-xs">Área Clínica</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(item => (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive(item.path, item.exact)
                  ? 'bg-teal-700 text-white shadow-md shadow-teal-200'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-teal-700'
              }`}>
              {item.icon}
              {item.label}
              {isActive(item.path, item.exact) && <ChevronRight size={14} className="ml-auto opacity-70" />}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <div className="flex items-center gap-3 px-3 py-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">AF</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-700 truncate">Alexandra F.</p>
              <p className="text-xs text-gray-400 truncate">Terapeuta Ocupacional</p>
            </div>
          </div>
          <button onClick={logout}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors font-medium">
            <LogOut size={16} /> Terminar sessão
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 25 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 lg:hidden flex flex-col shadow-2xl">
              <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-teal-700 rounded-xl flex items-center justify-center">
                    <span className="text-white font-display font-bold text-sm">A</span>
                  </div>
                  <p className="font-display font-bold text-teal-900">Alcançari</p>
                </div>
                <button onClick={() => setOpen(false)}><X size={20} className="text-gray-400" /></button>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                {NAV.map(item => (
                  <Link key={item.path} to={item.path} onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive(item.path, item.exact) ? 'bg-teal-700 text-white' : 'text-gray-500 hover:bg-gray-50'
                    }`}>
                    {item.icon} {item.label}
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t border-gray-50">
                <button onClick={logout}
                  className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                  <LogOut size={16} /> Terminar sessão
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar mobile */}
        <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
          <button onClick={() => setOpen(true)} className="p-2 hover:bg-gray-100 rounded-xl">
            <Menu size={20} className="text-gray-600" />
          </button>
          <p className="font-display font-bold text-teal-900 text-sm">Alcançari</p>
          <button className="p-2 hover:bg-gray-100 rounded-xl relative">
            <Bell size={18} className="text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full" />
          </button>
        </header>

        {/* Topbar desktop */}
        <header className="hidden lg:flex bg-white border-b border-gray-100 px-8 py-4 items-center justify-between sticky top-0 z-20">
          <div />
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-xl relative">
              <Bell size={18} className="text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full" />
            </button>
            <Link to="/" className="text-xs text-gray-400 hover:text-teal-600 transition-colors font-medium px-3 py-1.5 hover:bg-teal-50 rounded-lg">
              ← Voltar ao site
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
