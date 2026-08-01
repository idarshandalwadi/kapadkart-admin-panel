import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { createShop, getShop, updateShop } from '@/features/shops/api'
import LogoImageField from '@/features/shops/LogoImageField'
import FormSelect from '@/shared/components/FormSelect'

const CURRENCY_OPTIONS = [
  { value: 'INR', label: 'INR (₹)' },
  { value: 'USD', label: 'USD ($)' },
]

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
]

const EMPTY_FORM = {
  slug: '',
  name: '',
  company_name: '',
  page_title: '',
  phone_number: '',
  address: '',
  currency: 'INR',
  primary_color: '',
  secondary_color: '',
  logo_url: '',
  owner_email: '',
  owner_full_name: '',
  owner_password: '',
  status: 'active',
}

export default function ShopFormPage() {
  const { slug } = useParams()
  const isEdit = Boolean(slug)
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY_FORM)
  const [manualCompany, setManualCompany] = useState(false)
  const [manualPageTitle, setManualPageTitle] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!isEdit) return undefined
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const shop = await getShop(slug)
        if (cancelled) return
        const name = shop.name || ''
        const companyName = shop.company_name || ''
        const pageTitle = shop.page_title || ''
        setForm({
          slug: shop.slug || '',
          name,
          company_name: companyName,
          page_title: pageTitle,
          phone_number: shop.phone_number || '',
          address: shop.address || '',
          currency: CURRENCY_OPTIONS.some((opt) => opt.value === shop.currency)
            ? shop.currency
            : 'INR',
          primary_color: shop.primary_color || '',
          secondary_color: shop.secondary_color || '',
          logo_url: shop.logo_url || '',
          owner_email: shop.owner?.email || '',
          owner_full_name: shop.owner?.full_name || '',
          owner_password: '',
          status: shop.status === 'deleted' ? 'active' : shop.status || 'active',
        })
        setManualCompany(Boolean(companyName && companyName !== name))
        setManualPageTitle(Boolean(pageTitle && pageTitle !== name))
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
          toast.error(err.message || 'Failed to load shop')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [isEdit, slug])

  const onChange = (field) => (e) => {
    const value = e.target.value
    setForm((prev) => {
      if (field === 'name') {
        return {
          ...prev,
          name: value,
          company_name: manualCompany ? prev.company_name : value,
          page_title: manualPageTitle ? prev.page_title : value,
        }
      }
      return { ...prev, [field]: value }
    })
  }

  const onCompanyChange = (e) => {
    setManualCompany(true)
    setForm((prev) => ({ ...prev, company_name: e.target.value }))
  }

  const onPageTitleChange = (e) => {
    setManualPageTitle(true)
    setForm((prev) => ({ ...prev, page_title: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const phone = form.phone_number.trim()
    if (!phone) {
      const message = 'Phone number is required'
      setError(message)
      toast.error(message)
      setSubmitting(false)
      return
    }

    try {
      if (isEdit) {
        const payload = {
          name: form.name.trim(),
          status: form.status,
          company_name: form.company_name.trim() || form.name.trim(),
          page_title: form.page_title.trim() || form.company_name.trim() || form.name.trim(),
          phone_number: phone,
          address: form.address,
          currency: form.currency.trim() || 'INR',
          primary_color: form.primary_color.trim(),
          secondary_color: form.secondary_color.trim(),
          logo_url: form.logo_url.trim(),
          owner_email: form.owner_email.trim(),
          owner_full_name: form.owner_full_name.trim(),
        }
        if (form.owner_password) payload.owner_password = form.owner_password
        await updateShop(slug, payload)
        toast.success(`Updated shop "${form.slug || slug}"`)
      } else {
        const nextSlug = form.slug.trim().toLowerCase()
        await createShop({
          slug: nextSlug,
          name: form.name.trim(),
          company_name: form.company_name.trim() || form.name.trim(),
          page_title: form.page_title.trim() || form.company_name.trim() || form.name.trim(),
          phone_number: phone,
          address: form.address,
          currency: form.currency.trim() || 'INR',
          primary_color: form.primary_color.trim(),
          secondary_color: form.secondary_color.trim(),
          logo_url: form.logo_url.trim(),
          owner_email: form.owner_email.trim(),
          owner_full_name: form.owner_full_name.trim(),
          owner_password: form.owner_password,
        })
        toast.success(`Created shop "${nextSlug}"`)
      }
      navigate('/shops')
    } catch (err) {
      setError(err.message)
      toast.error(err.message || 'Failed to save shop')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <p className="inline-flex items-center gap-2 text-muted">
        <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
        Loading shop…
      </p>
    )
  }

  const fieldClass =
    'rounded-xl border border-border bg-light px-3 py-2.5 outline-none focus:border-accent'
  const labelClass = 'flex flex-col gap-1.5 text-sm font-medium text-ink-soft'

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="m-0 flex items-center gap-2.5 font-display text-[2.15rem] font-semibold tracking-[-0.03em] text-ink">
            {isEdit ? 'Edit Shop' : 'Add Shop'}
          </h2>
          <p className="mt-1 mb-0 text-muted">
            {isEdit
              ? 'Update shop branding, contact details, and owner account.'
              : 'Provision a new client shop with an owner login.'}
          </p>
        </div>
        <Link
          to="/shops"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white no-underline hover:bg-accent-hover"
        >
          <i className="fa-solid fa-arrow-left" aria-hidden="true" />
          Back to shops
        </Link>
      </div>

      {error && (
        <p className="m-0 inline-flex items-start gap-2 rounded-xl bg-danger-bg px-4 py-3 text-sm text-danger">
          <i className="fa-solid fa-circle-exclamation mt-0.5" aria-hidden="true" />
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6 shadow-sm"
      >
        <section className="grid grid-cols-1 gap-4 min-[640px]:grid-cols-2">
          <h3 className="m-0 inline-flex items-center gap-2 min-[640px]:col-span-2 text-base font-semibold text-ink">
            <i className="fa-solid fa-store text-muted" aria-hidden="true" />
            Shop details
          </h3>
          <label className={labelClass}>
            Shop name *
            <input className={fieldClass} value={form.name} onChange={onChange('name')} required />
          </label>
          <label className={labelClass}>
            URL slug *
            <input
              className={fieldClass}
              value={form.slug}
              onChange={onChange('slug')}
              required={!isEdit}
              disabled={isEdit}
              placeholder="acme-rentals"
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            />
          </label>
          <label className={labelClass}>
            Company name
            <input className={fieldClass} value={form.company_name} onChange={onCompanyChange} />
          </label>
          <label className={labelClass}>
            Page title
            <input className={fieldClass} value={form.page_title} onChange={onPageTitleChange} />
          </label>
          <label className={labelClass}>
            Phone *
            <input
              className={fieldClass}
              type="tel"
              value={form.phone_number}
              onChange={onChange('phone_number')}
              required
              maxLength={20}
            />
          </label>
          <label className={labelClass}>
            Currency
            <FormSelect
              name="currency"
              value={form.currency}
              onChange={onChange('currency')}
              options={CURRENCY_OPTIONS}
            />
          </label>
          <label className={`${labelClass} min-[640px]:col-span-2`}>
            Address
            <textarea
              className={fieldClass}
              rows={2}
              value={form.address}
              onChange={onChange('address')}
            />
          </label>
          <label className={labelClass}>
            Primary color
            <input
              className={fieldClass}
              value={form.primary_color}
              onChange={onChange('primary_color')}
              placeholder="#d97706"
            />
          </label>
          <label className={labelClass}>
            Secondary color
            <input
              className={fieldClass}
              value={form.secondary_color}
              onChange={onChange('secondary_color')}
              placeholder="#b45309"
            />
          </label>
          <LogoImageField
            value={form.logo_url}
            onChange={(logo_url) => setForm((prev) => ({ ...prev, logo_url }))}
          />
          {isEdit && (
            <label className={labelClass}>
              Status
              <FormSelect
                name="status"
                value={form.status}
                onChange={onChange('status')}
                options={STATUS_OPTIONS}
              />
            </label>
          )}
        </section>

        <hr className="border-border" />

        <section className="grid grid-cols-1 gap-4 min-[640px]:grid-cols-2">
          <h3 className="m-0 inline-flex items-center gap-2 min-[640px]:col-span-2 text-base font-semibold text-ink">
            <i className="fa-solid fa-user-shield text-muted" aria-hidden="true" />
            Owner account
          </h3>
          <label className={labelClass}>
            Owner email *
            <input
              type="email"
              className={fieldClass}
              value={form.owner_email}
              onChange={onChange('owner_email')}
              required
            />
          </label>
          <label className={labelClass}>
            Owner full name
            <input
              className={fieldClass}
              value={form.owner_full_name}
              onChange={onChange('owner_full_name')}
            />
          </label>
          <label className={`${labelClass} min-[640px]:col-span-2`}>
            {isEdit ? 'New password (optional)' : 'Owner password *'}
            <input
              type="password"
              className={fieldClass}
              value={form.owner_password}
              onChange={onChange('owner_password')}
              required={!isEdit}
              minLength={6}
              autoComplete="new-password"
            />
          </label>
        </section>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-accent px-5 py-3 font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
          >
            {submitting ? (
              <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
            ) : (
              <i className={`fa-solid ${isEdit ? 'fa-floppy-disk' : 'fa-plus'}`} aria-hidden="true" />
            )}
            {submitting ? 'Saving…' : isEdit ? 'Save changes' : 'Create shop'}
          </button>
          <Link
            to="/shops"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 font-semibold text-ink no-underline hover:bg-canvas"
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
            Cancel
          </Link>
        </div>

        {!isEdit && (
          <p className="m-0 inline-flex items-start gap-2 text-xs text-muted">
            <i className="fa-solid fa-link mt-0.5" aria-hidden="true" />
            <span>
              After create, the shop login URL will be{' '}
              <code>/kapadkart/t/{form.slug || '{slug}'}/login</code>
            </span>
          </p>
        )}
      </form>
    </div>
  )
}
