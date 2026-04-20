interface CountdownProps {
  value: number
}

export default function Countdown({ value }: CountdownProps) {
  return (
    <div className="countdown-overlay">
      <span key={value} className="countdown-number">
        {value}
      </span>
    </div>
  )
}
