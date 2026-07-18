import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext.jsx'

const suggestedPrompts = [
  'My landlord is withholding my deposit — what are my options?',
  'Explain what a non-compete clause means in plain English.',
  'What documents do I need to register a rental agreement?',
  'How do I respond to a legal notice from my employer?',
]

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

async function getAIResponse(messageHistory) {
  // Calls the local Express backend in ../backend, which holds the AI provider key server-side
  // so it never reaches the browser. Falls back to a clearly-labeled demo response if the
  // backend isn't running or isn't configured yet.
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
      body: JSON.stringify({ messages: messageHistory }),
    })

    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      throw new Error(body?.error || `Backend returned ${response.status}`)
    }

    const data = await response.json()
    return data?.reply || "I couldn't generate a response just now — please try again."
  } catch (err) {
    return (
      "[Demo mode] I couldn't reach the backend at " +
      BACKEND_URL +
      ". Make sure the server in /backend is running (`npm run dev` inside backend/) and that " +
      "ANTHROPIC_API_KEY is set in backend/.env. In the meantime — here's a general pointer: start by " +
      "gathering any written agreements or communications related to your situation, since most legal " +
      "next steps depend on what's already documented."
    )
  }
}

export default function AIChat() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(true)
  const scrollRef = useRef(null)

  useEffect(() => {
    async function loadHistory() {
      if (!user) return
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
      if (!error && data?.length) {
        setMessages(data.map((m) => ({ role: m.role, content: m.content })))
      }
      setLoadingHistory(false)
    }
    loadHistory()
  }, [user])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, sending])

  const persistMessage = async (role, content) => {
    if (!user) return
    await supabase.from('chat_messages').insert({ user_id: user.id, role, content })
  }

  const sendMessage = async (text) => {
    const trimmed = text.trim()
    if (!trimmed || sending) return
    const nextMessages = [...messages, { role: 'user', content: trimmed }]
    setMessages(nextMessages)
    setInput('')
    setSending(true)
    persistMessage('user', trimmed)

    const reply = await getAIResponse(nextMessages)
    setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    persistMessage('assistant', reply)
    setSending(false)
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-4xl flex-col rounded-xl border border-vellum-300 bg-vellum-50 shadow-card dark:border-ink-700 dark:bg-ink-900 dark:shadow-dark">
      <div className="flex items-center justify-between border-b border-vellum-300 px-5 py-4 dark:border-ink-700">
        <div>
          <p className="font-display text-lg font-medium text-ink-900 dark:text-vellum-50">
            AI Legal Assistant
          </p>
          <p className="text-xs text-ink-500 dark:text-vellum-400">
            General guidance only — not a substitute for a licensed attorney.
          </p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-seal-green/10 px-2.5 py-1 text-xs font-medium text-seal-green">
          <span className="h-1.5 w-1.5 rounded-full bg-seal-green" /> Online
        </span>
      </div>

      <div ref={scrollRef} className="scrollbar-thin flex-1 space-y-4 overflow-y-auto px-5 py-6">
        {loadingHistory ? (
          <p className="text-center text-sm text-ink-400 dark:text-vellum-500">Loading conversation…</p>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-seal border border-brass-500/50 font-display text-2xl text-brass-600 dark:text-brass-400">
              §
            </div>
            <div>
              <p className="font-display text-lg text-ink-900 dark:text-vellum-50">
                What's your legal question today?
              </p>
              <p className="mt-1 text-sm text-ink-500 dark:text-vellum-400">
                Try one of these, or type your own below.
              </p>
            </div>
            <div className="grid w-full max-w-md grid-cols-1 gap-2">
              {suggestedPrompts.map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="rounded-lg border border-vellum-300 px-4 py-2.5 text-left text-sm text-ink-700 transition hover:border-brass-500/60 hover:bg-vellum-100 dark:border-ink-600 dark:text-vellum-200 dark:hover:bg-ink-800"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-ink-900 text-vellum-50 dark:bg-brass-500 dark:text-ink-950'
                    : 'border border-vellum-300 bg-vellum-100 text-ink-800 dark:border-ink-700 dark:bg-ink-800 dark:text-vellum-100'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))
        )}
        {sending && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl border border-vellum-300 bg-vellum-100 px-4 py-3 dark:border-ink-700 dark:bg-ink-800">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink-400 dark:bg-vellum-500"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          sendMessage(input)
        }}
        className="flex items-center gap-2 border-t border-vellum-300 px-4 py-3 dark:border-ink-700"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your legal question…"
          className="flex-1 rounded-full border border-vellum-300 bg-vellum-100 px-4 py-2.5 text-sm text-text placeholder:text-ink-500/50 focus:border-brass-500 dark:border-ink-600 dark:bg-ink-800 dark:text-vellum-100"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-900 text-vellum-50 transition hover:bg-ink-800 disabled:opacity-40 dark:bg-brass-500 dark:text-ink-950 dark:hover:bg-brass-400"
          aria-label="Send message"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>
    </div>
  )
}
