import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ContentGenerator from './pages/ContentGenerator'
import Calendar from './pages/Calendar'
import Analytics from './pages/Analytics'
import Inbox from './pages/Inbox'
import { AppProvider } from './context/AppContext'

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/generator" element={<ContentGenerator />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/inbox" element={<Inbox />} />
          </Routes>
        </Layout>
      </div>
    </AppProvider>
  )
}

export default App