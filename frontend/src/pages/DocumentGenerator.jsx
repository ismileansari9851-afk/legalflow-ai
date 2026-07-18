import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext.jsx'

const initialForm = {
  landlordName: '',
  tenantName: '',
  propertyAddress: '',
  city: '',
  monthlyRent: '',
  securityDeposit: '',
  leaseStart: '',
  leaseDurationMonths: '11',
  noticePeriodDays: '30',
  purpose: 'Residential',
}

function buildRentalAgreement(f) {
  const start = f.leaseStart ? new Date(f.leaseStart).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '[Start Date]'
  return `RENTAL AGREEMENT

This Rental Agreement ("Agreement") is made on ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}, between:

LANDLORD: ${f.landlordName || '[Landlord Name]'}
and
TENANT: ${f.tenantName || '[Tenant Name]'}

for the property located at:
${f.propertyAddress || '[Property Address]'}, ${f.city || '[City]'}

1. TERM
The lease shall commence on ${start} and continue for a period of ${f.leaseDurationMonths || '[X]'} months, for ${f.purpose.toLowerCase()} purposes only.

2. RENT
The Tenant agrees to pay a monthly rent of ₹${f.monthlyRent || '[Amount]'}, payable in advance on or before the 5th day of each month.

3. SECURITY DEPOSIT
The Tenant shall pay a refundable security deposit of ₹${f.securityDeposit || '[Amount]'} prior to occupancy, refundable within 30 days of vacating the premises, subject to deductions for damages beyond normal wear and tear.

4. NOTICE PERIOD
Either party may terminate this Agreement by providing ${f.noticePeriodDays || '[X]'} days' written notice to the other party.

5. MAINTENANCE
The Tenant shall maintain the premises in good condition and shall promptly notify the Landlord of any damage or required repairs.

6. GOVERNING LAW
This Agreement shall be governed by the applicable rental and tenancy laws of the state in which the property is located.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.


_______________________              _______________________
Landlord Signature                   Tenant Signature

---
Generated with LegalFlow AI. This draft is a starting point only — have it reviewed by a licensed
attorney before signing, and adapt clauses to your local tenancy laws.`
}

export default function DocumentGenerator() {
  const { user } = useAuth()
  const [docType, setDocType] = useState('rental-agreement')
  const [form, setForm] = useState(initialForm)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const documentText = buildRentalAgreement(form)

  const handleDownload = () => {
    const blob = new Blob([documentText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rental-agreement-${form.tenantName || 'draft'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    await supabase.from('documents').insert({
      user_id: user.id,
      doc_type: docType,
      title: `Rental Agreement — ${form.tenantName || 'Untitled'}`,
      content: documentText,
      metadata: form,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass-600 dark:text-brass-400">
          Auto-drafting
        </p>
        <h2 className="mt-1 font-display text-2xl font-medium text-ink-900 dark:text-vellum-50">
          Document Generator
        </h2>

        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium text-ink-800 dark:text-vellum-200">
            Document type
          </label>
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="w-full rounded-lg border border-vellum-300 bg-vellum-50 px-3 py-2.5 text-sm text-text dark:border-ink-600 dark:bg-ink-900 dark:text-vellum-100"
          >
            <option value="rental-agreement">Rental Agreement</option>
            <option value="nda" disabled>NDA (coming soon)</option>
            <option value="employment-offer" disabled>Employment Offer Letter (coming soon)</option>
            <option value="notice" disabled>Legal Notice (coming soon)</option>
          </select>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Landlord name" value={form.landlordName} onChange={update('landlordName')} />
          <Field label="Tenant name" value={form.tenantName} onChange={update('tenantName')} />
          <Field label="Property address" value={form.propertyAddress} onChange={update('propertyAddress')} full />
          <Field label="City" value={form.city} onChange={update('city')} />
          <Field label="Monthly rent (₹)" value={form.monthlyRent} onChange={update('monthlyRent')} type="number" />
          <Field label="Security deposit (₹)" value={form.securityDeposit} onChange={update('securityDeposit')} type="number" />
          <Field label="Lease start date" value={form.leaseStart} onChange={update('leaseStart')} type="date" />
          <Field label="Duration (months)" value={form.leaseDurationMonths} onChange={update('leaseDurationMonths')} type="number" />
          <Field label="Notice period (days)" value={form.noticePeriodDays} onChange={update('noticePeriodDays')} type="number" />
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-800 dark:text-vellum-200">Purpose</label>
            <select
              value={form.purpose}
              onChange={update('purpose')}
              className="w-full rounded-lg border border-vellum-300 bg-vellum-50 px-3 py-2.5 text-sm text-text dark:border-ink-600 dark:bg-ink-900 dark:text-vellum-100"
            >
              <option>Residential</option>
              <option>Commercial</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleDownload}
            className="rounded-lg bg-ink-900 px-4 py-2.5 text-sm font-semibold text-vellum-50 transition hover:bg-ink-800 dark:bg-brass-500 dark:text-ink-950 dark:hover:bg-brass-400"
          >
            Download as .txt
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg border border-vellum-300 px-4 py-2.5 text-sm font-medium text-ink-800 transition hover:bg-vellum-200 disabled:opacity-60 dark:border-ink-600 dark:text-vellum-100 dark:hover:bg-ink-800"
          >
            {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save to my documents'}
          </button>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-ink-700 dark:text-vellum-200">Live preview</p>
        <div className="scrollbar-thin h-[calc(100vh-14rem)] overflow-y-auto rounded-xl border border-vellum-300 bg-vellum-50 p-6 font-mono text-xs leading-relaxed text-ink-800 shadow-card dark:border-ink-700 dark:bg-ink-900 dark:text-vellum-100 dark:shadow-dark">
          <pre className="whitespace-pre-wrap">{documentText}</pre>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', full = false }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="mb-1 block text-sm font-medium text-ink-800 dark:text-vellum-200">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-vellum-300 bg-vellum-50 px-3 py-2.5 text-sm text-text focus:border-brass-500 dark:border-ink-600 dark:bg-ink-900 dark:text-vellum-100"
      />
    </div>
  )
}
