export default function AuthShell({ eyebrow, title, subtitle, children }) {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-vellum-100 dark:bg-ink-950 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink-950 lg:flex lg:flex-col lg:justify-between lg:p-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 38px, rgba(245,246,243,0.5) 39px)',
          }}
        />
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-seal border border-brass-500/60 font-display text-lg text-brass-400">
            §
          </div>
          <span className="font-display text-xl tracking-tight text-vellum-50">LegalFlow AI</span>
        </div>
        <div className="relative z-10 max-w-md">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-brass-400">{eyebrow}</p>
          <h1 className="font-display text-4xl font-medium leading-tight text-vellum-50">{title}</h1>
          <p className="mt-4 text-sm leading-relaxed text-vellum-300">{subtitle}</p>
        </div>
        <div className="relative z-10 flex items-center gap-6 text-xs text-vellum-400">
          <span>AI legal chat</span>
          <span className="h-1 w-1 rounded-full bg-brass-500" />
          <span>Guided roadmaps</span>
          <span className="h-1 w-1 rounded-full bg-brass-500" />
          <span>Vetted lawyers</span>
        </div>
      </div>
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-seal border border-brass-500/60 font-display text-base text-brass-600 dark:text-brass-400">
              §
            </div>
            <span className="font-display text-lg tracking-tight text-ink-900 dark:text-vellum-50">
              LegalFlow AI
            </span>
          </div>
          <p className="mb-1 font-mono text-xs uppercase tracking-[0.2em] text-brass-600 dark:text-brass-400">
            {eyebrow}
          </p>
          <h2 className="mb-6 font-display text-2xl font-medium text-ink-900 dark:text-vellum-50">
            {title}
          </h2>
          {children}
        </div>
      </div>
    </div>
  )
}
