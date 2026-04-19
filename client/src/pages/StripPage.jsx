import { useLocation, useNavigate } from 'react-router-dom'

export default function StripPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const photos = state?.photos ?? []

  return (
    <div className="page strip-page">
      <h2>Your Strip</h2>
      <div className="strip-preview">
        {photos.map((src, i) => (
          <img key={i} src={src} alt={`Photo ${i + 1}`} className="strip-thumb" />
        ))}
      </div>
      <button className="sketch-btn" onClick={() => navigate('/')}>← Back to Menu</button>
    </div>
  )
}
