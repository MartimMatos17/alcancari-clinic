import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../lib/api'
import { useAuthStore } from '../store/authStore'

export default function NotificationBell() {
  const { user } = useAuthStore()
  const [count, setCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [requests, setRequests] = useState([])

  useEffect(() => {
    if (user?.role !== 'admin') return
    const load = async () => {
      try {
        const res = await api.get('/appointment-requests')
        const pending = res.data.filter(r => r.status === 'pending')
        setCount(pending.length)
        setRequests(pending.slice(0, 4))
      } catch {}
    }
    load()
    const interval = setInterval(load, 60000) // atualiza cada minuto
    return () => clearInterval(interval)
  }, [])

  if (user?.role !== 'admin') return (
    <button className="p-2 hover:bg-gray-100 rounded-xl relative">
      <Bell size={18} className="text-gray-600" />
    </button>
  )

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="p-2 hover:bg-gray-100 rounded-xl relative">
        <Bell size={18} className="text-gray-600" />
        {count > 0 && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {count}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                <p className="font-semibold text-gray-700 text-sm">Notificações</p>
                {count > 0 && <span className="text-xs bg-red-50 text-red-500 font-semibold px-2 py-0.5 rounded-full">{count} pendentes</span>}
              </div>
              {requests.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-sm">Sem notificações</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {requests.map(r => (
                    <Link key={r.id} to="/dashboard/pedidos" onClick={() => setOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-amber-600 text-xs font-bold">{r.name[0]}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-700 truncate">{r.name}</p>
                        <p className="text-xs text-gray-400">{r.service} · {r.preferred_time}</p>
                      </div>
                      <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-medium flex-shrink-0">Novo</span>
                    </Link>
                  ))}
                </div>
              )}
              <div className="px-4 py-3 border-t border-gray-50">
                <Link to="/dashboard/pedidos" onClick={() => setOpen(false)}
                  className="block text-center text-teal-600 text-sm font-semibold hover:text-teal-700">
                  Ver todos os pedidos →
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
