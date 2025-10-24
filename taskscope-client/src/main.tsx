import { createRoot } from 'react-dom/client'
import './index.css'
import { AppRouter } from './routes/AppRouter.tsx'
import React from 'react'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
)
