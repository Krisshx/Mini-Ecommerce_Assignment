import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

function showAppError(message) {
  let el = document.getElementById('app-error')
  if (!el) {
    el = document.createElement('div')
    el.id = 'app-error'
    Object.assign(el.style, {
      position: 'fixed',
      inset: '16px',
      zIndex: 9999,
      padding: '12px',
      background: 'rgba(192,40,40,0.95)',
      color: '#fff',
      fontFamily: 'monospace',
      whiteSpace: 'pre-wrap',
      borderRadius: '6px',
      maxHeight: '70vh',
      overflow: 'auto'
    })
    document.body.appendChild(el)
  }
  el.textContent = message
}

window.addEventListener('error', (ev) => {
  showAppError(`${ev.message}\n${ev.filename}:${ev.lineno}:${ev.colno}`)
})
window.addEventListener('unhandledrejection', (ev) => {
  try {
    const msg = ev.reason && (ev.reason.stack || ev.reason.message || String(ev.reason))
    showAppError(`Unhandled rejection:\n${msg}`)
  } catch (e) {
    showAppError('Unhandled rejection')
  }
})

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

