import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Countdown from '../components/Countdown.tsx'
import SketchButton from '../components/SketchButton.tsx'

type Phase = 'starting' | 'countdown' | 'snap' | 'done'

const TOTAL_PHOTOS = 4

export default function CameraPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const timer = (state as { timer?: number } | null)?.timer ?? 3

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [phase, setPhase] = useState<Phase>('starting')
  const [countdown, setCountdown] = useState(timer)
  const [photos, setPhotos] = useState<string[]>([])
  const [photoIndex, setPhotoIndex] = useState(0)

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        streamRef.current = stream
        if (videoRef.current) videoRef.current.srcObject = stream
        setPhase('countdown')
        setCountdown(timer)
      })
      .catch(() => navigate('/'))

    return () => streamRef.current?.getTracks().forEach((t) => t.stop())
  }, [])

  useEffect(() => {
    if (phase !== 'countdown') return
    if (countdown === 0) { setPhase('snap'); return }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(id)
  }, [phase, countdown])

  useEffect(() => {
    if (phase !== 'snap') return

    const video = videoRef.current!
    const canvas = canvasRef.current!
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')!.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/png')

    const next = [...photos, dataUrl]
    setPhotos(next)

    if (next.length < TOTAL_PHOTOS) {
      setPhotoIndex(next.length)
      setCountdown(timer)
      setPhase('countdown')
    } else {
      setPhase('done')
      streamRef.current?.getTracks().forEach((t) => t.stop())
      navigate('/strip', { state: { photos: next } })
    }
  }, [phase])

  return (
    <div className="page camera-page">
      <div className="camera-wrap">
        <video ref={videoRef} autoPlay playsInline className="viewfinder" />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {phase === 'countdown' && <Countdown value={countdown} />}
        {phase === 'snap' && <div className="flash" />}
      </div>

      <div className="camera-footer">
        <div className="photo-dots">
          {Array.from({ length: TOTAL_PHOTOS }).map((_, i) => (
            <span
              key={i}
              className={`dot ${i < photos.length ? 'taken' : ''} ${i === photoIndex && phase === 'countdown' ? 'active' : ''}`}
            />
          ))}
        </div>
        <p className="camera-hint">
          {phase === 'starting' && 'Starting camera...'}
          {phase === 'countdown' && `Photo ${photoIndex + 1} of ${TOTAL_PHOTOS}`}
          {phase === 'snap' && 'Click!'}
          {phase === 'done' && 'All done!'}
        </p>
        <SketchButton onClick={() => navigate('/')}>← Back</SketchButton>
      </div>
    </div>
  )
}
