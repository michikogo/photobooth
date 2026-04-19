export default function SketchButton({ children, onClick, variant = 'default', disabled = false, fullWidth = false }) {
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
