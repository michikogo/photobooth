export async function saveStrip(stripDataUrl) {
  const res = await fetch('/api/photos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stripDataUrl }),
  })
  if (!res.ok) throw new Error('Failed to save strip')
  return res.json()
}

export async function sendEmail(email, stripDataUrl) {
  const res = await fetch('/api/email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, stripDataUrl }),
  })
  if (!res.ok) throw new Error('Failed to send email')
  return res.json()
}
