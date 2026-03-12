import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`Bem-vindo, ${user.full_name.split(' ')[0]}!`)
      navigate('/dashboard')
    } catch (err) {
      toast.error('Email ou palavra-passe incorretos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-sand-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-teal-600 text-sm mb-8 hover:text-teal-800 transition-colors">
          <ArrowLeft size={16} /> Voltar ao site
        </Link>

        <div className="bg-white rounded-4xl shadow-xl p-8 border border-sand-100">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center text-white font-display font-bold text-2xl mx-auto mb-4">
              A
            </div>
            <h1 className="font-display text-2xl text-teal-800">Área Clínica</h1>
            <p className="text-gray-500 text-sm mt-1">Acesso para profissionais Alcançari</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                className="w-full border border-sand-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow"
                placeholder="nome@alcancari.pt"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Palavra-passe</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  className="w-full border border-sand-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow"
                />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary py-3 mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'A entrar...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
