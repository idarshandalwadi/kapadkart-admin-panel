import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

function formatDate(isoStr) {
  if (!isoStr) return '—'
  const d = new Date(isoStr)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function StatusBadge({ status }) {
  const styles = {
    active: 'bg-ok-bg text-ok border-ok/20',
    suspended: 'bg-warn-bg text-warn border-warn/20',
    deleted: 'bg-danger-bg text-danger border-danger/20',
  }
  const icons = {
    active: 'fa-circle-check',
    suspended: 'fa-pause',
    deleted: 'fa-trash',
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${
        styles[status] || 'bg-canvas text-muted border-border'
      }`}
    >
      <i className={`fa-solid ${icons[status] || 'fa-circle'} text-[0.65rem]`} aria-hidden="true" />
      {status}
    </span>
  )
}

export default function OverviewTab({ shop, onNavigateTab }) {
  const [copied, setCopied] = useState(false)
  const settings = shop.settings || {}
  const owner = shop.owner || {}

  const handleCopySlug = () => {
    navigator.clipboard.writeText(shop.slug)
    setCopied(true)
    toast.success(`Copied slug "${shop.slug}"`)
    setTimeout(() => setCopied(false), 2000)
  }

  const primaryColor = settings.primary_color || ''
  const secondaryColor = settings.secondary_color || ''

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner / Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/80 bg-surface p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border/80 bg-canvas">
            {settings.logo_url ? (
              <img
                src={settings.logo_url}
                alt={shop.name}
                className="h-full w-full object-contain p-1"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling?.classList.remove('hidden')
                }}
              />
            ) : null}
            <i
              className={`fa-solid fa-store text-xl text-muted/60 ${settings.logo_url ? 'hidden' : ''}`}
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="m-0 font-display text-xl font-bold text-ink">
                {settings.company_name || shop.name}
              </h3>
              <StatusBadge status={shop.status} />
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
              <span className="font-mono text-ink-soft">{shop.slug}</span>
              <button
                type="button"
                onClick={handleCopySlug}
                className="inline-flex cursor-pointer items-center gap-1 text-accent hover:underline"
                title="Copy slug"
              >
                <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`} />
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <span>•</span>
              <span>Created {formatDate(shop.created_at)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to={`/shops/${shop.slug}/edit`}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-white no-underline shadow-sm hover:bg-accent-hover transition-colors"
          >
            <i className="fa-solid fa-pen-to-square" />
            <span>Edit Store Settings</span>
          </Link>
        </div>
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Store & Web Presence */}
        <div className="rounded-2xl border border-border/80 bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/70 pb-3 mb-4">
            <h4 className="m-0 inline-flex items-center gap-2 font-display text-base font-semibold text-ink">
              <i className="fa-solid fa-globe text-accent" />
              Store & Identity
            </h4>
          </div>

          <div className="space-y-3.5 text-sm">
            <div className="flex justify-between border-b border-border/40 pb-2.5">
              <span className="text-muted">Display Name</span>
              <span className="font-medium text-ink">{shop.name}</span>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-2.5">
              <span className="text-muted">Company Name</span>
              <span className="font-medium text-ink">{settings.company_name || '—'}</span>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-2.5">
              <span className="text-muted">Page Title</span>
              <span className="font-medium text-ink">{settings.page_title || '—'}</span>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-2.5">
              <span className="text-muted">Store Currency</span>
              <span className="font-semibold text-accent">{settings.currency || 'INR'}</span>
            </div>
            <div className="flex justify-between border-b border-border/40 pb-2.5">
              <span className="text-muted">GST Number</span>
              <span className="font-mono text-ink-soft">{settings.gst_number || 'Not configured'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Tax Rate</span>
              <span className="font-medium text-ink">
                {settings.tax_rate !== undefined ? `${settings.tax_rate}%` : '0%'}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Branding */}
        <div className="rounded-2xl border border-border/80 bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/70 pb-3 mb-4">
            <h4 className="m-0 inline-flex items-center gap-2 font-display text-base font-semibold text-ink">
              <i className="fa-solid fa-palette text-accent" />
              Branding Tokens
            </h4>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <span className="text-xs font-medium text-muted block mb-1.5">Primary Brand Color</span>
              <div className="flex items-center gap-3">
                <div
                  className="h-9 w-9 rounded-xl border border-border/80 shadow-sm"
                  style={{ backgroundColor: primaryColor || '#2563eb' }}
                />
                <span className="font-mono text-xs font-semibold text-ink">
                  {primaryColor || '#2563eb (Default)'}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-medium text-muted block mb-1.5">Secondary Brand Color</span>
              <div className="flex items-center gap-3">
                <div
                  className="h-9 w-9 rounded-xl border border-border/80 shadow-sm"
                  style={{ backgroundColor: secondaryColor || '#f8fafc' }}
                />
                <span className="font-mono text-xs font-semibold text-ink">
                  {secondaryColor || '#f8fafc (Default)'}
                </span>
              </div>
            </div>

            <div className="border-t border-border/60 pt-3">
              <span className="text-xs font-medium text-muted block mb-2">Logo & Favicon</span>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex h-12 w-20 items-center justify-center rounded-lg border border-border/70 bg-canvas p-1">
                    {settings.logo_url ? (
                      <img
                        src={settings.logo_url}
                        alt="Logo"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-[0.7rem] text-muted">No Logo</span>
                    )}
                  </div>
                  <span className="text-[0.7rem] text-muted">Store Logo</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border/70 bg-canvas p-1">
                    {settings.favicon_url ? (
                      <img
                        src={settings.favicon_url}
                        alt="Favicon"
                        className="h-6 w-6 object-contain"
                      />
                    ) : (
                      <span className="text-[0.7rem] text-muted">None</span>
                    )}
                  </div>
                  <span className="text-[0.7rem] text-muted">Favicon</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Location */}
        <div className="rounded-2xl border border-border/80 bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/70 pb-3 mb-4">
            <h4 className="m-0 inline-flex items-center gap-2 font-display text-base font-semibold text-ink">
              <i className="fa-solid fa-address-book text-accent" />
              Contact & Address
            </h4>
          </div>

          <div className="space-y-3.5 text-sm">
            <div className="flex justify-between border-b border-border/40 pb-2.5">
              <span className="text-muted">Phone Number</span>
              {settings.phone_number ? (
                <a
                  href={`tel:${settings.phone_number}`}
                  className="font-medium text-accent hover:underline no-underline inline-flex items-center gap-1"
                >
                  <i className="fa-solid fa-phone text-xs" />
                  {settings.phone_number}
                </a>
              ) : (
                <span className="text-muted">—</span>
              )}
            </div>
            <div className="flex justify-between border-b border-border/40 pb-2.5">
              <span className="text-muted">UPI ID</span>
              <span className="font-mono text-ink-soft">{settings.upi_id || '—'}</span>
            </div>
            <div>
              <span className="text-muted block mb-1">Physical Address</span>
              <p className="m-0 whitespace-pre-line rounded-xl bg-canvas/60 p-3 text-xs text-ink-soft border border-border/60">
                {settings.address || 'No address specified.'}
              </p>
            </div>
          </div>
        </div>

        {/* Owner Account Card */}
        <div className="rounded-2xl border border-border/80 bg-surface p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/70 pb-3 mb-4">
            <h4 className="m-0 inline-flex items-center gap-2 font-display text-base font-semibold text-ink">
              <i className="fa-solid fa-user-shield text-accent" />
              Primary Owner Account
            </h4>
            {onNavigateTab && (
              <button
                type="button"
                onClick={() => onNavigateTab('users')}
                className="cursor-pointer text-xs font-semibold text-accent hover:underline"
              >
                View all users →
              </button>
            )}
          </div>

          {owner.id ? (
            <div className="space-y-3.5 text-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent font-bold">
                  {owner.full_name ? owner.full_name.charAt(0).toUpperCase() : 'O'}
                </div>
                <div>
                  <div className="font-semibold text-ink">{owner.full_name || 'Owner'}</div>
                  <div className="text-xs text-muted font-mono">{owner.email}</div>
                </div>
              </div>

              <div className="border-t border-border/40 pt-3 flex justify-between text-xs">
                <span className="text-muted">Account Registered</span>
                <span className="font-medium text-ink-soft">{formatDate(owner.created_at)}</span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-muted">Last Login</span>
                <span className="font-medium text-ink-soft">
                  {shop.last_login?.created_at ? formatDate(shop.last_login.created_at) : 'Never'}
                </span>
              </div>
            </div>
          ) : (
            <p className="m-0 text-xs text-muted">No owner account linked.</p>
          )}
        </div>
      </div>
    </div>
  )
}
