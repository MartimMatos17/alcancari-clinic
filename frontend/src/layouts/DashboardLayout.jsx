import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { 
  LayoutDashboard, Calendar, Users, ClipboardList, 
  FileText, BookOpen, Image, LogOut, Menu, X, Bell
} from 'lucide-react'
import { useState } from 'react'
import clsx from 'clsx'

const NAV = [
  { href: '/dashboard',             label: 'Dashboard',    icon: LayoutDashboard, exact: true },
  { href: '/dashboard/calendario',  label: 'Calendário',   icon: Calendar },
  { href: '/dashboard/marcacoes',   label: 'Marcações',    icon: ClipboardList },
  { href: '/dashboard/pacientes',   label: 'Pacientes',    icon: Users },
  { href: '/dashboard/sumarios',    label: 'Sumários',     icon: FileText },
  { href: '/dashboard/blog',        label: 'Blog',         icon: BookOpen,  roles: ['admin'] },
  { href: '/dashboard/media',       label: 'Média',        icon: Image,     roles: ['admin'] },
]

export default function DashboardLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [sideOpen, setSideOpen] = useState(true)

  const handleLogout = () => { logout(); navigate('/') }

  const navItems = NAV.filter(n => !n.roles || n.roles.includes(user?.role))

  return (
    <div className="flex h-screen bg-sand-50 font-body overflow-hidden">
      {/* Sidebar */}
      <aside className={clsx(
        'bg-teal-900 text-white flex flex-col transition-all duration-300 flex-shrink-0',
        sideOpen ? 'w-60' : 'w-16'
      )}>
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-teal-800 gap-3">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center font-bold text-white flex-shrink-0">A</div>
          {sideOpen && <span className="font-display text-lg font-semibold truncate">Alcançari</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.exact}
              className={({ isActive }) => clsx(
                'flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-colors text-sm',
                isActive ? 'bg-teal-700 text-white' : 'text-teal-200 hover:bg-teal-800 hover:text-white'
              )}
            >
              <item.icon size={18} className="flex-shrink-0" />
              {sideOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-teal-800 p-3">
          <div className={clsx('flex items-center gap-3 px-2 py-2', !sideOpen && 'justify-center')}>
            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
              {user?.full_name?.[0] || 'U'}
            </div>
            {sideOpen && (
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{user?.full_name}</p>
                <p className="text-xs text-teal-400 capitalize">{user?.role}</p>
              </div>
            )}
          </div>
          <button onClick={handleLogout} className={clsx(
            'flex items-center gap-2 px-2 py-2 mt-1 rounded-xl text-teal-300 hover:text-white hover:bg-teal-800 transition-colors text-sm w-full',
            !sideOpen && 'justify-center'
          )}>
            <LogOut size={16} />
            {sideOpen && 'Sair'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-sand-200 flex items-center justify-between px-6 flex-shrink-0">
          <button onClick={() => setSideOpen(!sideOpen)} className="p-2 rounded-lg text-gray-500 hover:bg-sand-100 transition-colors">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg text-gray-500 hover:bg-sand-100 relative">
              <Bell size={18} />
            </button>
            <div className="text-sm text-gray-600">Olá, <span className="font-medium text-teal-700">{user?.full_name?.split(' ')[0]}</span></div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
