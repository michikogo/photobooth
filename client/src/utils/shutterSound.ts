export function playShutterSound(): void {
  const ctx = new AudioContext()

  // Short burst of white noise shaped like a mechanical click
  const bufferSize = ctx.sampleRate * 0.08 // 80ms
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
  }

  const source = ctx.createBufferSource()
  source.buffer = buffer

  // High-pass filter to make it crisp, not boomy
  const filter = ctx.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.value = 1000

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.6, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)

  source.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)

  source.start()
  source.onended = () => ctx.close()
}
