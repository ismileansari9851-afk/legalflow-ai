import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const quickActions = [
  { to: '/chat', label: 'Ask the AI assistant', desc: 'Get plain-language answers to a legal question.', code: '02' },
  { to: '/roadmap', label: 'Continue your roadmap', desc: 'Pick up your matter where you left off.', code: '03' },
  { to: '/marketplace', label: 'Find a lawyer', desc: 'Browse vetted attorneys sorted by city.', code: '04' },
  { to: '/documents', label: 'Draft a document', desc: 'Generate a rental agreement or other filing.', code: '05' },
]

const stats = [
  { label: 'Open matters', value: '2' },
  { label: 'Roadmap progress', value: '60%' },
  { label: 'Documents drafted', value: '3' },
  { label: 'Saved lawyers', value: '4' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const firstName = (user?.user_metadata?.full_name || user?.email || 'there').split(' ')[0]

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass-600 dark:text-brass-400">
          Docket overview
        </p>
        <h2 className="mt-1 font-display text-2xl font-medium text-ink-900 dark:text-vellum-50">
          Good to see you, {firstName}.
        </h2>
        <p className="mt-1 text-sm text-ink-600 dark:text-vellum-300">
          Here's where your legal matters stand today.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-vellum-300 bg-vellum-50 p-4 shadow-card dark:border-ink-700 dark:bg-ink-900 dark:shadow-dark"
          >
            <p className="font-display text-2xl text-ink-900 dark:text-vellum-50">{s.value}</p>
            <p className="mt-1 text-xs text-ink-500 dark:text-vellum-400">{s.label}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="mb-3 font-display text-lg font-medium text-ink-900 dark:text-vellum-50">
          Quick actions
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group flex items-start gap-4 rounded-xl border border-vellum-300 bg-vellum-50 p-5 shadow-card transition hover:border-brass-500/60 dark:border-ink-700 dark:bg-ink-900 dark:shadow-dark dark:hover:border-brass-500/50"
            >
              <span className="font-mono text-xs text-ink-400 dark:text-vellum-500">{action.code}</span>
              <div>
                <p className="font-medium text-ink-900 group-hover:text-brass-700 dark:text-vellum-50 dark:group-hover:text-brass-400">
                  {action.label}
                </p>
                <p className="mt-1 text-sm text-ink-600 dark:text-vellum-300">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-vellum-300 bg-vellum-50/50 p-6 text-center dark:border-ink-700 dark:bg-ink-900/50">
        <p className="text-sm text-ink-600 dark:text-vellum-300">
          Connect your Supabase project to start saving chat history, roadmap progress, and documents to your
          account. See <span className="font-mono">README.md</span> for setup steps.
        </p>
      </div>
    </div>
  )
}
