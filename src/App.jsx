import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import InitialHome from './pages/InitialHome'
import Home from './pages/Home'
import Layout from './templates/layout'
import './App.css'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InitialHome />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  )
}