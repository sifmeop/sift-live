import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { Providers } from './providers/Providers'

import './index.css'
import './init-theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers />
  </StrictMode>,
)
