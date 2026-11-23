import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Researcher from './pages/researcher'
import ResearcherPanel from './pages/ResearcherPanel'
import Productions from './pages/Productions'
import Actions from './pages/Actions'
import Layout from './templates/layout'
import './App.css'

export default function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/acoes" element={<Actions />} />
          <Route path="/pesquisadores" element={<Researcher />} />
          <Route path="/pesquisadores/:id" element={<ResearcherPanel />} />
          <Route path="/producoes" element={<Productions />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  )
}
