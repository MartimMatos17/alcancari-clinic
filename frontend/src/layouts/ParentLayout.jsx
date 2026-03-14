import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { LogOut, Home, Calendar, FileText, Bell } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ParentLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }
  const initials = user?.full_name?.split(' ').slice(0,2).map(n => n[0]).join('') || '?'

  return (
    <div className="min-h-screen bg-[#fdf9f3]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/familia" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-teal-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">A</span>
            </div>
            <div>
              <p className="font-display font-bold text-teal-900 text-sm">Alcançari</p>
              <p className="text-gray-400 text-xs">Área da Família</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">{initials}</span>
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user?.full_name?.split(' ')[0]}
              </span>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 text-sm transition-colors px-3 py-2 hover:bg-red-50 rounded-xl">
              <LogOut size={15} /> <span className="hidden sm:block">Sair</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
