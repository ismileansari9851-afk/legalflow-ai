import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'

const app = express()
app.use(express.json({ limit: '1mb' }))
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  })
)

const supabaseAdmin =
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null

const SYSTEM_PROMPT = `You are a helpful legal information assistant embedded in a product called
LegalFlow AI. You explain legal concepts in plain language, help users understand their options,
and point out when they should consult a licensed attorney. You do not provide binding legal advice,
and you say so when a question requires it.`

// Verifies the Supabase access token sent by the frontend (if Supabase is configured).
// If Supabase env vars aren't set, requests pass through unauthenticated — fine for local
// experimentation, but you should configure Supabase before exposing this beyond localhost.
async function requireUser(req, res, next) {
  if (!supabaseAdmin) {
    req.user = null
    return next()
  }
  const authHeader = req.headers.authorization || ''
  const token = authHeader.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: 'Missing Authorization bearer token.' })
  }
  const { data, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !data?.user) {
    return res.status(401).json({ error: 'Invalid or expired session.' })
  }
  req.user = data.user
  next()
}

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    supabaseConfigured: Boolean(supabaseAdmin),
  })
})

app.post('/api/chat', requireUser, async (req, res) => {
  const { messages } = req.body || {}
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Request body must include a non-empty "messages" array.' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(200).json({
      reply:
        "[Demo mode] GEMINI_API_KEY isn't set on the backend yet, so I can't reach the AI model. " +
        "Add it to backend/.env and restart the server to enable real responses. In the meantime — " +
        "a good first step for most legal questions is gathering any written agreements or communications " +
        "related to your situation, since next steps usually depend on what's already documented.",
    })
  }

  // Gemini doesn't use "assistant"/"user" — it uses "model"/"user" — and takes the system
  // prompt in a separate field rather than mixed into the message list.
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
        }),
      }
    )

    if (!response.ok) {
      const errText = await response.text()
      console.error('Gemini API error:', response.status, errText)
      return res.status(502).json({ error: 'The AI provider returned an error. Check server logs.' })
    }

    const data = await response.json()
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sorry, I could not generate a response.'
    res.json({ reply })
  } catch (err) {
    console.error('Chat proxy error:', err)
    res.status(500).json({ error: 'Unexpected server error while contacting the AI provider.' })
  }
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`LegalFlow AI backend listening on http://localhost:${port}`)
  console.log(`  Gemini key configured: ${Boolean(process.env.GEMINI_API_KEY)}`)
  console.log(`  Supabase auth configured: ${Boolean(supabaseAdmin)}`)
})
