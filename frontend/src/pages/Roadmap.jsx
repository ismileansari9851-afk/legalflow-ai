import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext.jsx'
import { roadmapTemplates } from '../data/roadmapTemplates'

export default function Roadmap() {
  const { user } = useAuth()
  const [templateKey, setTemplateKey] = useState('rental-dispute')
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(true)

  const template = roadmapTemplates[templateKey]

  useEffect(() => {
    async function loadProgress() {
      if (!user) return
      const { data } = await supabase
        .from('roadmap_progress')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()
      if (data) {
        setTemplateKey(data.template_key)
        setCurrentStep(data.current_step)
      }
      setLoading(false)
    }
    loadProgress()
  }, [user])

  const saveProgress = async (nextTemplateKey, nextStep) => {
    if (!user) return
    await supabase
      .from('roadmap_progress')
      .upsert(
        { user_id: user.id, template_key: nextTemplateKey, current_step: nextStep },
        { onConflict: 'user_id' }
      )
  }

  const handleTemplateChange = (key) => {
    setTemplateKey(key)
    setCurrentStep(0)
    saveProgress(key, 0)
  }

  const advanceStep = () => {
    const next = Math.min(currentStep + 1, template.steps.length - 1)
    setCurrentStep(next)
    saveProgress(templateKey, next)
  }

  const goToStep = (idx) => {
    if (idx > currentStep + 1) return
    setCurrentStep(idx)
    saveProgress(templateKey, idx)
  }

  const progressPct = Math.round((currentStep / (template.steps.length - 1)) * 100)

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass-600 dark:text-brass-400">
            Matter type
          </p>
          <h2 className="mt-1 font-display text-2xl font-medium text-ink-900 dark:text-vellum-50">
            Legal Roadmap
          </h2>
        </div>
        <select
          value={templateKey}
          onChange={(e) => handleTemplateChange(e.target.value)}
          className="rounded-lg border border-vellum-300 bg-vellum-50 px-3 py-2 text-sm text-text dark:border-ink-600 dark:bg-ink-800 dark:text-vellum-100"
        >
          {Object.entries(roadmapTemplates).map(([key, t]) => (
            <option key={key} value={key}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {!loading && (
        <>
          <div>
            <div className="mb-2 flex justify-between text-xs text-ink-500 dark:text-vellum-400">
              <span>Step {currentStep + 1} of {template.steps.length}</span>
              <span>{progressPct}% complete</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-vellum-300 dark:bg-ink-700">
              <div
                className="h-full rounded-full bg-brass-500 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          <ol className="relative space-y-0">
            {template.steps.map((step, idx) => {
              const status =
                idx < currentStep ? 'complete' : idx === currentStep ? 'current' : 'upcoming'
              const isLast = idx === template.steps.length - 1
              return (
                <li key={idx} className="relative flex gap-5 pb-10 last:pb-0">
                  {!isLast && (
                    <span
                      className={`absolute left-[19px] top-10 h-full w-0.5 ${
                        status === 'complete' ? 'bg-brass-500' : 'bg-vellum-300 dark:bg-ink-700'
                      }`}
                    />
                  )}
                  <button
                    onClick={() => goToStep(idx)}
                    className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-seal border-2 font-mono text-xs font-semibold transition ${
                      status === 'complete'
                        ? 'border-brass-500 bg-brass-500 text-ink-950'
                        : status === 'current'
                        ? 'border-brass-500 bg-vellum-50 text-brass-600 ring-4 ring-brass-500/15 dark:bg-ink-900 dark:text-brass-400'
                        : 'border-vellum-300 bg-vellum-50 text-ink-400 dark:border-ink-600 dark:bg-ink-900 dark:text-vellum-500'
                    }`}
                    aria-label={`Go to step ${idx + 1}`}
                  >
                    {status === 'complete' ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      String(idx + 1).padStart(2, '0')
                    )}
                  </button>
                  <div className={`pt-1.5 ${status === 'upcoming' ? 'opacity-60' : ''}`}>
                    <p className="font-display text-base font-medium text-ink-900 dark:text-vellum-50">
                      {step.title}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-600 dark:text-vellum-300">
                      {step.description}
                    </p>
                    {status === 'current' && !isLast && (
                      <button
                        onClick={advanceStep}
                        className="mt-3 rounded-lg bg-ink-900 px-4 py-2 text-xs font-semibold text-vellum-50 transition hover:bg-ink-800 dark:bg-brass-500 dark:text-ink-950 dark:hover:bg-brass-400"
                      >
                        Mark step complete
                      </button>
                    )}
                    {status === 'current' && isLast && (
                      <span className="mt-3 inline-block rounded-lg bg-seal-green/10 px-3 py-1.5 text-xs font-medium text-seal-green">
                        Final step — matter concludes here
                      </span>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        </>
      )}
    </div>
  )
}
