import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { compositeStrip } from '../utils/compositeStrip.ts'
import { saveStrip } from '../utils/api.ts'
import EmailModal from '../components/EmailModal.tsx'
import SketchButton from '../components/SketchButton.tsx'

export default function StripPage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const photos = (state as { photos?: string[] } | null)?.photos ?? []

  const [stripDataUrl, setStripDataUrl] = useState<string | null>(null)
  const [showEmail, setShowEmail] = useState(false)

  useEffect(() => {
    if (!photos.length) { navigate('/'); return }

    compositeStrip(photos).then((dataUrl) => {
      setStripDataUrl(dataUrl)
      saveStrip(dataUrl).catch(() => {})
    })
  }, [])

  function handleDownload() {
    if (!stripDataUrl) return
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
        <SketchButton onClick={handleDownload} disabled={!stripDataUrl}>⬇ Download</SketchButton>
        <SketchButton onClick={() => setShowEmail(true)} disabled={!stripDataUrl}>✉ Email</SketchButton>
        <SketchButton onClick={() => navigate('/')}>← Back</SketchButton>
      </div>

      {showEmail && stripDataUrl && (
        <EmailModal stripDataUrl={stripDataUrl} onClose={() => setShowEmail(false)} />
      )}
    </div>
  )
}
