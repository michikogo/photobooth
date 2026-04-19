export default function Countdown({ value }) {
  return (
    <div className="countdown-overlay">
      <span key={value} className="countdown-number">
        {value}
      </span>
    </div>
  )
}
