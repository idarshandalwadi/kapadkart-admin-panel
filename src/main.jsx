import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from '@/app/App'
import { AuthProvider } from '@/features/auth/AuthContext'
import AppToaster from '@/shared/components/AppToaster'
import '@/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <AppToaster />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
