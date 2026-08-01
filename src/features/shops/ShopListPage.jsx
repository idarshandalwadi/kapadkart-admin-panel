import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import {
  listShops,
  restoreShop,
  setShopStatus,
  softDeleteShop,
} from '@/features/shops/api'
import ConfirmDialog from '@/shared/components/ConfirmDialog'

function StatusBadge({ status }) {
  const styles = {
    active: 'bg-ok-bg text-ok',
    suspended: 'bg-warn-bg text-warn',
    deleted: 'bg-danger-bg text-danger',
  }
  const icons = {
    active: 'fa-circle-check',
    suspended: 'fa-pause',
    deleted: 'fa-trash',
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles[status] || 'bg-canvas text-muted'}`}
    >
      <i className={`fa-solid ${icons[status] || 'fa-circle'} text-[0.65rem]`} aria-hidden="true" />
      {status}
    </span>
  )
}

const actionBtn =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-semibold disabled:opacity-50'

export default function ShopListPage() {
  const [shops, setShops] = useState([])
  const [includeDeleted, setIncludeDeleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [busySlug, setBusySlug] = useState(null)
  const [pendingAction, setPendingAction] = useState(null)

  const load = async (showDeleted = includeDeleted) => {
    setLoading(true)
    try {
      const data = await listShops({ includeDeleted: showDeleted })
      setShops(data)
    } catch (err) {
      toast.error(err.message || 'Failed to load shops')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load(includeDeleted)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [includeDeleted])

  const runAction = async (slug, action, successMessage) => {
    setBusySlug(slug)
    try {
      await action()
      toast.success(successMessage)
      setPendingAction(null)
      await load(includeDeleted)
    } catch (err) {
      toast.error(err.message || 'Action failed')
    } finally {
      setBusySlug(null)
    }
  }

  const handleConfirm = async () => {
    if (!pendingAction) return
    const { type, shop } = pendingAction

    if (type === 'delete') {
      await runAction(shop.slug, () => softDeleteShop(shop.slug), `Deleted shop "${shop.slug}"`)
      return
    }

    if (type === 'suspend') {
      await runAction(
        shop.slug,
        () => setShopStatus(shop.slug, 'suspended'),
        `Suspended shop "${shop.slug}"`,
      )
    }
  }

  const confirming = Boolean(pendingAction && busySlug === pendingAction.shop.slug)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="m-0 inline-flex items-center gap-3 font-display text-[2.15rem] font-semibold tracking-[-0.03em] text-ink">
            <i className="fa-solid fa-store text-accent" aria-hidden="true" />
            Registered Shops
          </h2>
          <p className="mt-1 mb-0 text-muted">
            Add, update, suspend, or soft-delete client shops.
          </p>
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={includeDeleted}
            onChange={(e) => setIncludeDeleted(e.target.checked)}
          />
          <i className="fa-solid fa-eye-slash text-muted" aria-hidden="true" />
          Show deleted
        </label>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
        {loading ? (
          <p className="m-0 inline-flex items-center gap-2 p-6 text-muted">
            <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
            Loading shops…
          </p>
        ) : shops.length === 0 ? (
          <div className="p-8 text-center">
            <i className="fa-solid fa-store text-3xl text-muted/50" aria-hidden="true" />
            <p className="mt-3 mb-0 text-muted">No shops yet.</p>
            <Link
              to="/shops/new"
              className="mt-3 inline-flex items-center gap-2 font-semibold text-accent no-underline"
            >
              <i className="fa-solid fa-circle-plus" aria-hidden="true" />
              Create your first shop
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead className="bg-canvas text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Shop</th>
                  <th className="px-4 py-3 font-semibold">Owner</th>
                  <th className="px-4 py-3 font-semibold">Phone</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shops.map((shop) => {
                  const busy = busySlug === shop.slug
                  return (
                    <tr key={shop.id} className="border-t border-border">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-ink">{shop.company_name || shop.name}</div>
                        <div className="text-xs text-muted">{shop.slug}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div>{shop.owner?.full_name || '—'}</div>
                        <div className="text-xs text-muted">{shop.owner?.email || '—'}</div>
                      </td>
                      <td className="px-4 py-3">{shop.phone_number || '—'}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={shop.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {shop.status !== 'deleted' && (
                            <Link
                              to={`/shops/${shop.slug}/edit`}
                              className={`${actionBtn} text-ink no-underline hover:bg-canvas`}
                            >
                              <i className="fa-solid fa-pen-to-square" aria-hidden="true" />
                              Edit
                            </Link>
                          )}
                          {shop.status === 'active' && (
                            <button
                              type="button"
                              disabled={busy}
                              className={`${actionBtn} text-warn`}
                              onClick={() => setPendingAction({ type: 'suspend', shop })}
                            >
                              <i className="fa-solid fa-pause" aria-hidden="true" />
                              Suspend
                            </button>
                          )}
                          {shop.status === 'suspended' && (
                            <button
                              type="button"
                              disabled={busy}
                              className={`${actionBtn} text-ok`}
                              onClick={() =>
                                runAction(
                                  shop.slug,
                                  () => setShopStatus(shop.slug, 'active'),
                                  `Activated shop "${shop.slug}"`,
                                )
                              }
                            >
                              {busy ? (
                                <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
                              ) : (
                                <i className="fa-solid fa-play" aria-hidden="true" />
                              )}
                              Activate
                            </button>
                          )}
                          {shop.status !== 'deleted' ? (
                            <button
                              type="button"
                              disabled={busy}
                              className={`${actionBtn} text-danger`}
                              onClick={() => setPendingAction({ type: 'delete', shop })}
                            >
                              <i className="fa-solid fa-trash" aria-hidden="true" />
                              Delete
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={busy}
                              className={`${actionBtn} text-ok`}
                              onClick={() =>
                                runAction(
                                  shop.slug,
                                  () => restoreShop(shop.slug),
                                  `Restored shop "${shop.slug}"`,
                                )
                              }
                            >
                              {busy ? (
                                <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
                              ) : (
                                <i className="fa-solid fa-rotate-left" aria-hidden="true" />
                              )}
                              Restore
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(pendingAction)}
        title={pendingAction?.type === 'suspend' ? 'Suspend shop' : 'Delete shop'}
        message={
          pendingAction
            ? pendingAction.type === 'suspend'
              ? `Suspend "${pendingAction.shop.company_name || pendingAction.shop.name}" (${pendingAction.shop.slug})? The shop owner will not be able to sign in until it is activated again.`
              : `Soft-delete "${pendingAction.shop.company_name || pendingAction.shop.name}" (${pendingAction.shop.slug})? You can restore it later from the deleted list.`
            : ''
        }
        confirmLabel={pendingAction?.type === 'suspend' ? 'Suspend' : 'Delete'}
        variant={pendingAction?.type === 'suspend' ? 'warn' : 'danger'}
        loading={confirming}
        onConfirm={handleConfirm}
        onCancel={() => {
          if (!confirming) setPendingAction(null)
        }}
      />
    </div>
  )
}
