// src/main.tsx
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css' 

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)