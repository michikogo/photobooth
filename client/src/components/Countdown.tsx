import React from "react";

interface CountdownProps {
  value: number;
}

const Countdown = ({ value }: CountdownProps) => {
  return (
    <div className="countdown-overlay">
      <span key={value} className="countdown-number">
        {value}
      </span>
    </div>
  );
};

export default Countdown;
