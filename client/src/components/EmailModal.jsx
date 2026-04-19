import { useState } from 'react'
import { sendEmail } from '../utils/api.js'

export default function EmailModal({ stripDataUrl, onClose }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  async function handleSend() {
    if (!email) return
    setStatus('sending')
    try {
      await sendEmail(email, stripDataUrl)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card sketch-card" onClick={(e) => e.stopPropagation()}>
        {status === 'success' ? (
          <>
            <p className="modal-success">✉️ Sent! Check your inbox.</p>
            <button className="sketch-btn" onClick={onClose}>Close</button>
          </>
        ) : (
          <>
            <h2>Send to email</h2>
            <input
              className="sketch-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            {status === 'error' && <p className="modal-error">Something went wrong. Try again.</p>}
            <div className="modal-actions">
              <button className="sketch-btn" onClick={onClose}>Cancel</button>
              <button className="sketch-btn start-btn" onClick={handleSend} disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending...' : 'Send'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
