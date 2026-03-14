import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function ProtectedRoute({ children, roles }) {
  const { user, token } = useAuthStore()

  if (!token || !user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) {
    if (user.role === 'parent') return <Navigate to="/familia" replace />
    return <Navigate to="/dashboard" replace />
  }

  return children
}
