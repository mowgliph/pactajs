import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { syncManager } from './services/syncManager'
import './i18n'

// Initialize sync manager
syncManager.startPeriodicSync();
syncManager.listenForOnline();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)