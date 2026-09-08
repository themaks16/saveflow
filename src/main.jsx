import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './Profile.css'
import { supabase } from './lib/supabase'
import './financeEnhancements'
import App from './App.jsx'

globalThis.supabase = supabase

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
