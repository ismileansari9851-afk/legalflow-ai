import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import AuthShell from './AuthShell.jsx'

export default function SignupPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    const { data, error } = await signUp(email, password, fullName)
    setBusy(false)
    if (error) {
      setError(error.message)
      return
    }
    if (data?.session) {
      navigate('/')
    } else {
      setNotice('Check your inbox to confirm your email, then sign in.')
    }
  }

  return (
    <AuthShell
      eyebrow="Case No. 0002 — New client intake"
      title="Open your file."
      subtitle="Create an account to start chatting with the AI assistant, track your legal roadmap, and generate documents."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink-800 dark:text-vellum-200">Full name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border border-vellum-300 bg-vellum-50 px-4 py-2.5 text-sm text-text placeholder:text-ink-500/50 focus:border-brass-500 dark:border-ink-600 dark:bg-ink-800 dark:text-vellum-100"
            placeholder="Jordan Ellis"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink-800 dark:text-vellum-200">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-vellum-300 bg-vellum-50 px-4 py-2.5 text-sm text-text placeholder:text-ink-500/50 focus:border-brass-500 dark:border-ink-600 dark:bg-ink-800 dark:text-vellum-100"
            placeholder="you@firm.com"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-ink-800 dark:text-vellum-200">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-vellum-300 bg-vellum-50 px-4 py-2.5 text-sm text-text placeholder:text-ink-500/50 focus:border-brass-500 dark:border-ink-600 dark:bg-ink-800 dark:text-vellum-100"
            placeholder="At least 6 characters"
          />
        </div>
        {error && (
          <p className="rounded-md bg-seal-brick/10 px-3 py-2 text-sm text-seal-brick">{error}</p>
        )}
        {notice && (
          <p className="rounded-md bg-seal-green/10 px-3 py-2 text-sm text-seal-green">{notice}</p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-ink-900 px-4 py-2.5 text-sm font-semibold text-vellum-50 transition hover:bg-ink-800 disabled:opacity-60 dark:bg-brass-500 dark:text-ink-950 dark:hover:bg-brass-400"
        >
          {busy ? 'Filing…' : 'Create account'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ink-600 dark:text-vellum-300">
        Already have a file?{' '}
        <Link to="/login" className="font-medium text-brass-600 hover:underline dark:text-brass-400">
          Sign in
        </Link>
      </p>
    </AuthShell>
  )
}
