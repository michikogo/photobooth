import { Routes, Route } from 'react-router-dom'
import MenuPage from './pages/MenuPage.jsx'
import CameraPage from './pages/CameraPage.jsx'
import StripPage from './pages/StripPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MenuPage />} />
      <Route path="/camera" element={<CameraPage />} />
      <Route path="/strip" element={<StripPage />} />
    </Routes>
  )
}

export default App
