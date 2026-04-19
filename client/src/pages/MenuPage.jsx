import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TIMER_OPTIONS = [3, 5, 10]

export default function MenuPage() {
  const [timer, setTimer] = useState(3)
  const navigate = useNavigate()

  return (
    <div className="page menu-page">
      <div className="sketch-card">
        <h1 className="title">📷 Photobooth</h1>
        <p className="subtitle">Strike a pose. Make it count.</p>

        <div className="timer-row">
          <label htmlFor="timer">Countdown timer</label>
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

        <button
          className="sketch-btn start-btn"
          onClick={() => navigate('/camera', { state: { timer } })}
        >
          Start Photobooth
        </button>
      </div>
    </div>
  )
}
