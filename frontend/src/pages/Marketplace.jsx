import { useMemo, useState } from 'react'
import { mockLawyers, cities } from '../data/mockLawyers'

export default function Marketplace() {
  const [city, setCity] = useState('All cities')
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('city')

  const filtered = useMemo(() => {
    let list = mockLawyers.filter((l) => (city === 'All cities' ? true : l.city === city))
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter(
        (l) => l.name.toLowerCase().includes(q) || l.specialty.toLowerCase().includes(q)
      )
    }
    list = [...list].sort((a, b) => {
      if (sortBy === 'city') return a.city.localeCompare(b.city) || b.rating - a.rating
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'experience') return b.experience - a.experience
      return 0
    })
    return list
  }, [city, query, sortBy])

  const grouped = useMemo(() => {
    if (sortBy !== 'city') return { All: filtered }
    return filtered.reduce((acc, l) => {
      acc[l.city] = acc[l.city] || []
      acc[l.city].push(l)
      return acc
    }, {})
  }, [filtered, sortBy])

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass-600 dark:text-brass-400">
          Vetted attorneys
        </p>
        <h2 className="mt-1 font-display text-2xl font-medium text-ink-900 dark:text-vellum-50">
          Lawyer Marketplace
        </h2>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or specialty…"
          className="flex-1 rounded-lg border border-vellum-300 bg-vellum-50 px-4 py-2.5 text-sm text-text placeholder:text-ink-500/50 focus:border-brass-500 dark:border-ink-600 dark:bg-ink-900 dark:text-vellum-100"
        />
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-lg border border-vellum-300 bg-vellum-50 px-3 py-2.5 text-sm text-text dark:border-ink-600 dark:bg-ink-900 dark:text-vellum-100"
        >
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-lg border border-vellum-300 bg-vellum-50 px-3 py-2.5 text-sm text-text dark:border-ink-600 dark:bg-ink-900 dark:text-vellum-100"
        >
          <option value="city">Sort by city</option>
          <option value="rating">Sort by rating</option>
          <option value="experience">Sort by experience</option>
        </select>
      </div>

      {filtered.length === 0 && (
        <p className="rounded-xl border border-dashed border-vellum-300 p-8 text-center text-sm text-ink-500 dark:border-ink-700 dark:text-vellum-400">
          No lawyers match your filters. Try a different city or search term.
        </p>
      )}

      {Object.entries(grouped).map(([groupCity, lawyers]) => (
        <div key={groupCity}>
          {sortBy === 'city' && (
            <div className="mb-3 flex items-center gap-3">
              <h3 className="font-display text-base font-medium text-ink-900 dark:text-vellum-50">
                {groupCity}
              </h3>
              <span className="h-px flex-1 bg-vellum-300 dark:bg-ink-700" />
              <span className="font-mono text-xs text-ink-400 dark:text-vellum-500">
                {lawyers.length} {lawyers.length === 1 ? 'lawyer' : 'lawyers'}
              </span>
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lawyers.map((l) => (
              <div
                key={l.id}
                className="flex flex-col rounded-xl border border-vellum-300 bg-vellum-50 p-5 shadow-card dark:border-ink-700 dark:bg-ink-900 dark:shadow-dark"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-900 font-mono text-sm font-semibold text-vellum-50 dark:bg-brass-500 dark:text-ink-950">
                    {l.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  {l.verified && (
                    <span className="rounded-full bg-seal-green/10 px-2 py-0.5 text-[11px] font-medium text-seal-green">
                      Verified
                    </span>
                  )}
                </div>
                <p className="mt-3 font-display text-base font-medium text-ink-900 dark:text-vellum-50">
                  {l.name}
                </p>
                <p className="text-sm text-ink-600 dark:text-vellum-300">{l.specialty}</p>
                <p className="mt-1 text-xs text-ink-400 dark:text-vellum-500">{l.city}</p>

                <div className="mt-4 flex items-center gap-4 text-xs text-ink-500 dark:text-vellum-400">
                  <span className="flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-brass-500">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01z" />
                    </svg>
                    {l.rating} ({l.reviews})
                  </span>
                  <span>{l.experience} yrs exp.</span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-vellum-300 pt-4 dark:border-ink-700">
                  <span className="font-mono text-sm text-ink-800 dark:text-vellum-100">{l.rate}</span>
                  <button className="rounded-lg bg-ink-900 px-3 py-1.5 text-xs font-semibold text-vellum-50 transition hover:bg-ink-800 dark:bg-brass-500 dark:text-ink-950 dark:hover:bg-brass-400">
                    Request consult
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
