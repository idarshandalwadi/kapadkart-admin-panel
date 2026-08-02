import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/features/auth/AuthContext'
import logo from '@/assets/kapad-kart-logo.svg'

export default function LoginPage() {
  const { authenticated, login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  if (authenticated) return <Navigate to="/shops" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await login(username, password)
      toast.success('Signed in successfully')
      navigate('/shops', { replace: true })
    } catch (err) {
      const message = err.message || 'Invalid username or password'
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
              <i className="fa-solid fa-user text-muted" aria-hidden="true" />
              Username
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              placeholder="kapadkart"
              className="rounded-xl border border-border bg-canvas px-3 py-2.5 font-medium outline-none focus:border-accent"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink-soft">
            <span className="inline-flex items-center gap-2">
              <i className="fa-solid fa-lock text-muted" aria-hidden="true" />
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="rounded-xl border border-border bg-canvas px-3 py-2.5 font-medium outline-none focus:border-accent"
            />
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
