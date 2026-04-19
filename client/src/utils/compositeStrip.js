const PHOTO_W = 400
const PHOTO_H = 300
const PAD_X = 24
const PAD_Y = 24
const GAP = 12
const LABEL_H = 36

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.src = src
  })
}

export async function compositeStrip(photos) {
  const canvas = document.createElement('canvas')
  canvas.width = PHOTO_W + PAD_X * 2
  canvas.height = PHOTO_H * photos.length + GAP * (photos.length - 1) + PAD_Y * 2 + LABEL_H

  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = '#1a1a2e'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Photos
  await document.fonts.load('700 16px Caveat')
  const images = await Promise.all(photos.map(loadImage))

  images.forEach((img, i) => {
    const y = PAD_Y + i * (PHOTO_H + GAP)
    ctx.drawImage(img, PAD_X, y, PHOTO_W, PHOTO_H)
  })

  // Label
  const labelY = canvas.height - LABEL_H + 10
  ctx.fillStyle = '#faf7f0'
  ctx.font = '700 22px Caveat'
  ctx.textAlign = 'center'
  ctx.fillText('📷 photobooth', canvas.width / 2, labelY)

  ctx.font = '400 16px Caveat'
  ctx.fillStyle = 'rgba(250,247,240,0.6)'
  ctx.fillText(new Date().toLocaleDateString(), canvas.width / 2, labelY + 18)

  return canvas.toDataURL('image/png')
}
