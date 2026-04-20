import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PhotoboothIllustration from "../components/PhotoboothIllustration";
import BoothSign from "../components/BoothSign";

const TIMER_OPTIONS = [3, 5, 10] as const;
type Mode = "Modern" | "Vintage";

const MenuPage = () => {
  const [timer, setTimer] = useState(3);
  const [mode, setMode] = useState<Mode>("Modern");
  const navigate = useNavigate();

  return (
    <div className="page menu-page">
      <div className="booth-wrap">
        <PhotoboothIllustration />

        <BoothSign />

        {/* Settings in poster area */}
        <div className="booth-overlay">
          <div className="booth-settings">
            <div className="setting-group">
              <label className="setting-label">Mode</label>
              <div className="mode-toggle">
                {(["Modern", "Vintage"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    className={`toggle-opt ${mode === m ? "active" : ""}`}
                    onClick={() => setMode(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-group">
              <label className="setting-label">Timer</label>
              <div className="timer-options">
                {TIMER_OPTIONS.map((s) => (
                  <button
                    key={s}
                    className={`sketch-btn timer-btn ${timer === s ? "active" : ""}`}
                    onClick={() => setTimer(s)}
                  >
                    {s}s
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Start button on the machine body */}
        <button
          className="booth-start"
          onClick={() => navigate("/camera", { state: { timer, mode } })}
        >
          Start
        </button>
      </div>
      <label>by Michiko</label>
    </div>
  );
};

export default MenuPage;
