import { Toaster } from 'sonner'

export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      closeButton
      richColors
      duration={4000}
      toastOptions={{
        classNames: {
          toast: 'border border-border bg-surface text-ink shadow-md font-sans text-[0.9rem]',
          title: 'font-semibold text-ink',
          description: 'text-muted',
          success: 'border-[#b7e4c7] bg-ok-bg text-ok',
          error: 'border-[#f5c2c0] bg-danger-bg text-danger',
          warning: 'border-[#f0d19a] bg-warn-bg text-warn',
          closeButton: 'border-border bg-surface text-muted',
        },
      }}
    />
  )
}
