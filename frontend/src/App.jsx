import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import DashboardLayout from './components/layout/DashboardLayout.jsx'
import LoginPage from './components/auth/LoginPage.jsx'
import SignupPage from './components/auth/SignupPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AIChat from './pages/AIChat.jsx'
import Roadmap from './pages/Roadmap.jsx'
import Marketplace from './pages/Marketplace.jsx'
import DocumentGenerator from './pages/DocumentGenerator.jsx'

function RequireAuth({ children }) {
  const { session, loading } = useAuth()
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-vellum-100 dark:bg-ink-950">
        <div className="animate-pulse font-mono text-sm text-brass-600 dark:text-brass-400">
          Opening the file&hellip;
        </div>
      </div>
    )
  }
  if (!session) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="chat" element={<AIChat />} />
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="documents" element={<DocumentGenerator />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
