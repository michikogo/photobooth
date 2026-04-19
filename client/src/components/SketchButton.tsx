import { type ReactNode } from 'react'

interface SketchButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'default' | 'primary'
  disabled?: boolean
  fullWidth?: boolean
}

export default function SketchButton({
  children,
  onClick,
  variant = 'default',
  disabled = false,
  fullWidth = false,
}: SketchButtonProps) {
  return (
    <button
      className={`sketch-btn ${variant === 'primary' ? 'start-btn' : ''} ${fullWidth ? 'full-width' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
