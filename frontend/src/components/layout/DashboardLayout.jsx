import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'

const titles = {
  '/': 'Dashboard',
  '/chat': 'AI Legal Chat',
  '/roadmap': 'Legal Roadmap',
  '/marketplace': 'Lawyer Marketplace',
  '/documents': 'Document Generator',
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const title = titles[location.pathname] || 'LegalFlow AI'

  return (
    <div className="flex min-h-screen bg-vellum-100 dark:bg-ink-950">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
