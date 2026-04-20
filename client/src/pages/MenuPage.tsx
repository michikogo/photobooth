import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SketchCard from '../components/SketchCard.tsx'
import SketchButton from '../components/SketchButton.tsx'

const TIMER_OPTIONS = [3, 5, 10]

export default function MenuPage() {
  const [timer, setTimer] = useState(3)
  const navigate = useNavigate()

  return (
    <div className="page menu-page">
      <SketchCard>
        <h1 className="title">📷 Photobooth</h1>
        <p className="subtitle">Strike a pose. Make it count.</p>

        <div className="timer-row">
          <label>Countdown timer</label>
          <div className="timer-options">
            {TIMER_OPTIONS.map((s) => (
              <button
                key={s}
                className={`sketch-btn timer-btn ${timer === s ? 'active' : ''}`}
                onClick={() => setTimer(s)}
              >
                {s}s
              </button>
            ))}
          </div>
        </div>

        <SketchButton variant="primary" fullWidth onClick={() => navigate('/camera', { state: { timer } })}>
          Start Photobooth
        </SketchButton>
      </SketchCard>
    </div>
  )
}
