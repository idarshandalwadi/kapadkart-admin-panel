import { useEffect, useId, useRef } from 'react'

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}) {
  const titleId = useId()
  const descriptionId = useId()
  const cancelRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    cancelRef.current?.focus()

    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !loading) onCancel?.()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, loading, onCancel])

  if (!open) return null

  const confirmClass =
    variant === 'danger'
      ? 'bg-danger text-white hover:bg-[#9b1c1c]'
      : variant === 'warn'
        ? 'bg-warn text-white hover:bg-[#78350f]'
        : 'bg-accent text-white hover:bg-accent-hover'

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="presentation">
      <button
        type="button"
        className="absolute inset-0 cursor-pointer border-0 bg-[rgba(16,24,32,0.52)] p-0"
        aria-label="Close dialog"
        disabled={loading}
        onClick={() => {
          if (!loading) onCancel?.()
        }}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative z-[1] w-full max-w-[26rem] rounded-2xl border border-border bg-surface p-5 shadow-lg"
      >
        <h2
          id={titleId}
          className="m-0 inline-flex items-center gap-2 font-display text-[1.2rem] font-semibold tracking-[-0.02em] text-ink"
        >
          <i
            className={`fa-solid ${
              variant === 'danger'
                ? 'fa-triangle-exclamation text-danger'
                : variant === 'warn'
                  ? 'fa-circle-exclamation text-warn'
                  : 'fa-circle-question text-accent'
            }`}
            aria-hidden="true"
          />
          {title}
        </h2>
        <p id={descriptionId} className="mt-3 mb-0 text-[0.95rem] leading-relaxed text-muted">
          {message}
        </p>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            ref={cancelRef}
            type="button"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold text-ink hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
            onClick={onCancel}
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-xl border-0 px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${confirmClass}`}
            disabled={loading}
            onClick={onConfirm}
          >
            {loading ? (
              <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
            ) : (
              <i
                className={`fa-solid ${variant === 'danger' ? 'fa-trash' : 'fa-check'}`}
                aria-hidden="true"
              />
            )}
            {loading ? 'Please wait…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
