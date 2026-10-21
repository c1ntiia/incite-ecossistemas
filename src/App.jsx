import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import InitialHome from './components/InitialHome'
import Home from './components/Home'
import Layout from './components/layout'
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