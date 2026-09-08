import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './Profile.css'
import './MobileFix.css'
import { supabase } from './lib/supabase'
import './financeEnhancements'
import App from './App.jsx'
import './PremiumShell.css'
import './PremiumReadability.css'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}))
}

globalThis.supabase = supabase

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
