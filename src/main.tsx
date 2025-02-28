import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './globals.css'
import App from './App.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Navbar } from './components/navbar.tsx'
import Pomodoro from './components/pomodoro/pomodoro.tsx'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <StrictMode>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='/pomodoro' element={<Pomodoro />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  </ThemeProvider>
)
