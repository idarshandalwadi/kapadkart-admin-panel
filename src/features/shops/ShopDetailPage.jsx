import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { getShopDetail } from '@/features/shops/api'
import Tabs from '@/shared/components/Tabs'
import OverviewTab from './tabs/OverviewTab'
import UsersTab from './tabs/UsersTab'
import UsageTab from './tabs/UsageTab'
import ActivityTab from './tabs/ActivityTab'
import EmailsTab from './tabs/EmailsTab'
import NotesTab from './tabs/NotesTab'
import DangerZoneTab from './tabs/DangerZoneTab'

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
      <i className={`fa-solid ${icons[status] || 'fa-circle'} text-[0.65rem]`} />
      {status}
    </span>
  )
}

export default function ShopDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'overview'

  const [shop, setShop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notesCount, setNotesCount] = useState(null)

  const loadShop = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getShopDetail(slug)
      setShop(data)
      if (data?.notes_count !== undefined) {
        setNotesCount(data.notes_count)
      }
    } catch (err) {
      if (err?.silent) return
      setError(err.message || 'Failed to load shop details')
      toast.error(err.message || 'Failed to load shop details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (slug) {
      loadShop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const handleTabChange = (tabId) => {
    const nextParams = new URLSearchParams(searchParams)
    if (tabId === 'overview') {
      nextParams.delete('tab')
    } else {
      nextParams.set('tab', tabId)
    }
    setSearchParams(nextParams)
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'fa-store' },
    { id: 'users', label: 'Users', icon: 'fa-users' },
    { id: 'usage', label: 'Usage & KPIs', icon: 'fa-chart-pie' },
    { id: 'activity', label: 'Activity', icon: 'fa-list-check' },
    { id: 'emails', label: 'Emails', icon: 'fa-envelope' },
    {
      id: 'notes',
      label: 'Admin Notes',
      icon: 'fa-note-sticky',
      badge: notesCount !== null && notesCount > 0 ? notesCount : undefined,
      badgeVariant: 'accent',
    },
    {
      id: 'danger',
      label: 'Danger Zone',
      icon: 'fa-triangle-exclamation',
      badgeVariant: 'danger',
    },
  ]

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Link to="/shops" className="text-muted hover:text-accent no-underline">
            Shops
          </Link>
          <span>/</span>
          <span className="text-ink font-mono">{slug}</span>
        </div>

        <div className="h-28 w-full animate-pulse rounded-2xl bg-surface border border-border" />
        <div className="h-96 w-full animate-pulse rounded-2xl bg-surface border border-border" />
      </div>
    )
  }

  if (error || !shop) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2 text-xs text-muted">
          <Link to="/shops" className="text-muted hover:text-accent no-underline">
            Shops
          </Link>
          <span>/</span>
          <span className="text-ink font-mono">{slug}</span>
        </div>

        <div className="rounded-2xl border border-danger/20 bg-surface p-12 text-center shadow-sm">
          <i className="fa-solid fa-store-slash text-4xl text-danger/60 mb-3" />
          <h3 className="font-display text-xl font-bold text-ink">Shop Not Found</h3>
          <p className="mt-2 text-sm text-muted">
            {error || `The shop with slug "${slug}" could not be retrieved.`}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/shops')}
              className="cursor-pointer rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-white hover:bg-accent-hover transition-colors"
            >
              Back to Shops List
            </button>
            <button
              type="button"
              onClick={loadShop}
              className="cursor-pointer rounded-xl border border-border bg-canvas px-4 py-2 text-xs font-semibold text-ink-soft hover:bg-border/40 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  const settings = shop.settings || {}

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <nav className="flex items-center gap-2 text-muted">
          <Link to="/dashboard" className="hover:text-accent no-underline">
            Dashboard
          </Link>
          <span>/</span>
          <Link to="/shops" className="hover:text-accent no-underline">
            Shops
          </Link>
          <span>/</span>
          <span className="font-semibold text-ink">{settings.company_name || shop.name}</span>
        </nav>

        <Link
          to="/shops"
          className="inline-flex items-center gap-1.5 font-semibold text-accent hover:underline no-underline"
        >
          <i className="fa-solid fa-arrow-left text-[0.7rem]" />
          <span>Back to all shops</span>
        </Link>
      </div>

      {/* Main Shop Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/80 bg-surface p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-canvas">
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
              className={`fa-solid fa-store text-2xl text-muted/60 ${settings.logo_url ? 'hidden' : ''}`}
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="m-0 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                {settings.company_name || shop.name}
              </h1>
              <StatusBadge status={shop.status} />
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted">
              <span className="font-mono text-ink-soft bg-canvas px-2 py-0.5 rounded-md border border-border/60">
                slug: {shop.slug}
              </span>
              {settings.phone_number && (
                <span>
                  <i className="fa-solid fa-phone mr-1 text-muted/80" />
                  {settings.phone_number}
                </span>
              )}
              {shop.owner?.email && (
                <span>
                  <i className="fa-solid fa-envelope mr-1 text-muted/80" />
                  {shop.owner.email}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to={`/shops/${shop.slug}/edit`}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-accent px-4 py-2 text-xs font-semibold text-white no-underline shadow-sm hover:bg-accent-hover transition-colors"
          >
            <i className="fa-solid fa-pen-to-square" />
            <span>Edit Shop</span>
          </Link>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={handleTabChange}
      />

      {/* Active Tab Content Area */}
      <div className="mt-1">
        {activeTab === 'overview' && (
          <OverviewTab shop={shop} onNavigateTab={handleTabChange} />
        )}
        {activeTab === 'users' && (
          <UsersTab slug={shop.slug} />
        )}
        {activeTab === 'usage' && (
          <UsageTab shop={shop} onNavigateTab={handleTabChange} />
        )}
        {activeTab === 'activity' && (
          <ActivityTab slug={shop.slug} />
        )}
        {activeTab === 'emails' && (
          <EmailsTab tenantId={shop.id} />
        )}
        {activeTab === 'notes' && (
          <NotesTab
            slug={shop.slug}
            onNotesCountChange={(cnt) => setNotesCount(cnt)}
          />
        )}
        {activeTab === 'danger' && (
          <DangerZoneTab shop={shop} onShopUpdated={loadShop} />
        )}
      </div>
    </div>
  )
}
