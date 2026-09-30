import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/features/auth/AuthContext'
import logo from '@/assets/kapad-kart-logo.svg'

export default function LoginPage() {
  const { authenticated, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  if (authenticated) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await login(email, password)
      toast.success('Signed in successfully')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const message = err.message || 'Invalid email or password'
      setError(message)
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-sm">
        <img
          src={logo}
          alt="KapadKart"
          className="mx-auto h-40 w-auto object-contain"
        />
        <h1 className="mt-5 text-center font-display text-[2rem] font-semibold tracking-[-0.03em] text-ink">
          Admin Panel
        </h1>
        <p className="mt-2 text-center text-[0.95rem] text-muted">
          Sign in with your platform admin account to manage shops.
        </p>

        <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink-soft">
            <span className="inline-flex items-center gap-2">
              <i className="fa-solid fa-envelope text-muted" aria-hidden="true" />
              Email Address
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="admin@kapadkart.com"
              className="rounded-xl border border-border bg-canvas px-3 py-2.5 font-medium outline-none transition-colors focus:border-accent"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink-soft">
            <span className="inline-flex items-center gap-2">
              <i className="fa-solid fa-lock text-muted" aria-hidden="true" />
              Password
            </span>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-border bg-canvas py-2.5 pr-11 pl-3 font-medium outline-none transition-colors focus:border-accent"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-muted transition-colors hover:text-ink focus:text-accent focus:outline-none"
              >
                <i
                  className={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}
                  aria-hidden="true"
                />
              </button>
            </div>
          </label>

          {error && (
            <p className="m-0 inline-flex items-start gap-2 rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger">
              <i className="fa-solid fa-circle-exclamation mt-0.5" aria-hidden="true" />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 font-bold text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {submitting ? (
              <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
            ) : (
              <i className="fa-solid fa-right-to-bracket" aria-hidden="true" />
            )}
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

