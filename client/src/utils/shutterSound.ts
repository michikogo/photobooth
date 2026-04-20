function playNoise(
  ctx: AudioContext,
  startTime: number,
  duration: number,
  gainValue: number,
  lowpassFreq: number,
): void {
  const bufferSize = Math.floor(ctx.sampleRate * duration)
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }

  const source = ctx.createBufferSource()
  source.buffer = buffer

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = lowpassFreq

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(gainValue, startTime)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

  source.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  source.start(startTime)
}

export function playShutterSound(): void {
  const ctx = new AudioContext()

  // Stage 1 — mirror slap: low thud at t=0
  playNoise(ctx, ctx.currentTime, 0.06, 0.8, 400)

  // Stage 2 — shutter close: crisp snap ~80ms later
  playNoise(ctx, ctx.currentTime + 0.08, 0.05, 0.5, 2000)

  setTimeout(() => ctx.close(), 300)
}
