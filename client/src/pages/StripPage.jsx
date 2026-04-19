import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { compositeStrip } from '../utils/compositeStrip.js'
import { saveStrip } from '../utils/api.js'
import EmailModal from '../components/EmailModal.jsx'

export default function StripPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const photos = state?.photos ?? []

  const [stripDataUrl, setStripDataUrl] = useState(null)
  const [showEmail, setShowEmail] = useState(false)

  useEffect(() => {
    if (!photos.length) { navigate('/'); return }

    compositeStrip(photos).then((dataUrl) => {
      setStripDataUrl(dataUrl)
      saveStrip(dataUrl).catch(() => {})
    })
  }, [])

  function handleDownload() {
    const a = document.createElement('a')
    a.href = stripDataUrl
    a.download = 'photobooth-strip.png'
    a.click()
  }

  return (
    <div className="page strip-page">
      <h2>Your Strip</h2>

      <div className="strip-wrap">
        {stripDataUrl
          ? <img src={stripDataUrl} alt="Photo strip" className="strip-img" />
          : <div className="strip-loading">Developing your strip...</div>
        }
      </div>

      <div className="strip-actions">
        <button className="sketch-btn" onClick={handleDownload} disabled={!stripDataUrl}>
          ⬇ Download
        </button>
        <button className="sketch-btn" onClick={() => setShowEmail(true)} disabled={!stripDataUrl}>
          ✉ Email
        </button>
        <button className="sketch-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
      </div>

      {showEmail && (
        <EmailModal stripDataUrl={stripDataUrl} onClose={() => setShowEmail(false)} />
      )}
    </div>
  )
}
