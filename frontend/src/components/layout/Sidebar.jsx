import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard', code: '01', end: true },
  { to: '/chat', label: 'AI Legal Chat', code: '02' },
  { to: '/roadmap', label: 'Legal Roadmap', code: '03' },
  { to: '/marketplace', label: 'Lawyer Marketplace', code: '04' },
  { to: '/documents', label: 'Document Generator', code: '05' },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-ink-950/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-vellum-300 bg-vellum-50 transition-transform duration-200 dark:border-ink-700 dark:bg-ink-900 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-vellum-300 px-6 dark:border-ink-700">
          <div className="flex h-8 w-8 items-center justify-center rounded-seal border border-brass-500/60 font-display text-sm text-brass-600 dark:text-brass-400">
            §
          </div>
          <span className="font-display text-lg tracking-tight text-ink-900 dark:text-vellum-50">
            LegalFlow AI
          </span>
        </div>

        <nav className="px-3 py-6">
          <p className="mb-3 px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-500 dark:text-vellum-400">
            Case Docket
          </p>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `docket-tab flex items-center gap-3 rounded-r-md px-3 py-2.5 text-sm transition ${
                      isActive
                        ? 'bg-ink-900 text-vellum-50 shadow-tab dark:bg-brass-500 dark:text-ink-950'
                        : 'text-ink-700 hover:bg-vellum-200 dark:text-vellum-200 dark:hover:bg-ink-800'
                    }`
                  }
                >
                  <span className="font-mono text-[11px] opacity-60">{item.code}</span>
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full border-t border-vellum-300 p-4 dark:border-ink-700">
          <div className="rounded-lg bg-vellum-200 p-3 text-xs text-ink-600 dark:bg-ink-800 dark:text-vellum-300">
            <p className="font-medium text-ink-800 dark:text-vellum-100">Not legal advice</p>
            <p className="mt-1 leading-relaxed">
              LegalFlow AI helps you prepare and understand legal matters. For binding advice, consult a
              licensed attorney via the Marketplace.
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
