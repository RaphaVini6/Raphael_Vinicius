import { Suspense, lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PreferencesProvider } from './context/Preferences'
import Layout from './components/layout/Layout'
import { Loader } from './components/ui'
import Home from './pages/Home'

// other pages load on demand
const Exhibits = lazy(() => import('./pages/Exhibits'))
const ProbeDetail = lazy(() => import('./pages/ProbeDetail'))
const Missions = lazy(() => import('./pages/Missions'))
const Simulator = lazy(() => import('./pages/Simulator'))
const Learn = lazy(() => import('./pages/Learn'))
const NotFound = lazy(() => import('./pages/NotFound'))

const page = (Page) => (
  <Suspense fallback={<Loader />}>
    <Page />
  </Suspense>
)

export default function App() {
  return (
    <PreferencesProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/exhibits" element={page(Exhibits)} />
            <Route path="/exhibits/:id" element={page(ProbeDetail)} />
            <Route path="/missions" element={page(Missions)} />
            <Route path="/simulator" element={page(Simulator)} />
            <Route path="/learn" element={page(Learn)} />
            <Route path="*" element={page(NotFound)} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PreferencesProvider>
  )
}
