import { Routes, Route } from 'react-router-dom'
import MenuPage from './pages/MenuPage.tsx'
import CameraPage from './pages/CameraPage.tsx'
import StripPage from './pages/StripPage.tsx'

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
