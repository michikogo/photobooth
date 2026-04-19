import { useEffect, useRef, type ReactNode } from 'react'
import rough from 'roughjs'

interface SketchCardProps {
  children: ReactNode
  className?: string
}

export default function SketchCard({ children, className = '' }: SketchCardProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const svg = svgRef.current
    if (!wrap || !svg) return

    function draw() {
      const { width, height } = wrap!.getBoundingClientRect()
      svg!.setAttribute('width', String(width))
      svg!.setAttribute('height', String(height))
      svg!.innerHTML = ''

      const rc = rough.svg(svg!)
      const rect = rc.rectangle(4, 4, width - 8, height - 8, {
        stroke: '#1a1a2e',
        strokeWidth: 2.5,
        roughness: 1.8,
        fillStyle: 'solid',
        fill: '#ffffff',
      })
      svg!.appendChild(rect)
    }

    draw()
    const observer = new ResizeObserver(draw)
    observer.observe(wrap)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={wrapRef} className={`sketch-card-rough ${className}`}>
      <svg ref={svgRef} className="sketch-card-svg" aria-hidden="true" />
      <div className="sketch-card-content">
        {children}
      </div>
    </div>
  )
}
