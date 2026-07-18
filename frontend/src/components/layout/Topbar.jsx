import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Topbar({ onMenuClick, title }) {
  const { theme, toggleTheme } = useTheme()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const initials = (user?.user_metadata?.full_name || user?.email || '?')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-vellum-300 bg-vellum-50/90 px-4 backdrop-blur dark:border-ink-700 dark:bg-ink-900/90 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-md p-2 text-ink-700 hover:bg-vellum-200 dark:text-vellum-200 dark:hover:bg-ink-800 lg:hidden"
          aria-label="Open menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
          </svg>
        </button>
        <h1 className="font-display text-lg font-medium text-ink-900 dark:text-vellum-50">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-vellum-300 text-ink-700 transition hover:bg-vellum-200 dark:border-ink-600 dark:text-vellum-200 dark:hover:bg-ink-800"
        >
          {theme === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-900 font-mono text-xs font-semibold text-vellum-50 dark:bg-brass-500 dark:text-ink-950"
          >
            {initials}
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 top-11 w-52 rounded-lg border border-vellum-300 bg-vellum-50 py-1 shadow-card dark:border-ink-700 dark:bg-ink-800"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <div className="border-b border-vellum-300 px-4 py-2 text-xs text-ink-500 dark:border-ink-700 dark:text-vellum-400">
                {user?.email}
              </div>
              <button
                onClick={handleSignOut}
                className="w-full px-4 py-2 text-left text-sm text-seal-brick hover:bg-vellum-200 dark:hover:bg-ink-700"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
