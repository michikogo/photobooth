import React, { useEffect, useState } from "react";
import { generateBorder, getSessionBorders, ApiError } from "../utils/api";
import type { SavedBorder } from "../utils/api";
import SketchButton from "./SketchButton";

type Status = "idle" | "loading" | "error";

interface BorderModalProps {
  sessionId?: number;
  initialCode?: string;
  onApply: (borderUrl: string, usedCode?: string) => void;
  onClose: () => void;
}

const ERROR_MESSAGES: Record<number, string> = {
  404: "Code not found.",
  409: "Code has already been used.",
  410: "Code has expired.",
};

const BorderModal = ({ sessionId, initialCode, onApply, onClose }: BorderModalProps) => {
  const [code, setCode] = useState(initialCode ?? "");
  const [occasion, setOccasion] = useState("birthday");
  const [vibe, setVibe] = useState("vintage");
  const [color, setColor] = useState("warm tones");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [savedBorders, setSavedBorders] = useState<SavedBorder[]>([]);

  useEffect(() => {
    if (!sessionId) return;
    getSessionBorders(sessionId).then(setSavedBorders);
  }, [sessionId]);

  const handleGenerate = async () => {
    if (!code.trim()) return;
    setStatus("loading");
    setErrorMsg("");

    const prompt = `photo booth border frame, ${occasion}, ${vibe}, ${color}, decorative, no people`;
    try {
      const data = await generateBorder(code.trim().toUpperCase(), prompt, sessionId);
      setSavedBorders((prev) => [
        { id: data.borderId, session_id: sessionId ?? null, border_path: data.borderPath, prompt, created_at: new Date().toISOString() },
        ...prev,
      ]);
      onApply(data.borderDataUrl, code.trim().toUpperCase());
    } catch (err) {
      const status = err instanceof ApiError ? err.status : 0;
      setErrorMsg(ERROR_MESSAGES[status] ?? "Something went wrong. Try again.");
      setStatus("error");
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card sketch-card" onClick={(e) => e.stopPropagation()}>
        <h2>Generate AI Border</h2>

        {savedBorders.length > 0 && (
          <div className="border-gallery">
            <p className="border-gallery-label">Previous borders</p>
            <div className="border-gallery-scroll">
              {savedBorders.map((b) => (
                <img
                  key={b.id}
                  src={b.border_path}
                  alt={b.prompt ?? "border"}
                  className="border-gallery-thumb"
                  title={b.prompt ?? undefined}
                  onClick={() => onApply(b.border_path)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="generate-boarder-input-container">
          <label className="generate-boarder-label">Code: </label>
          <input
            className="sketch-input"
            type="text"
            placeholder="Enter your code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        <div className="generate-boarder-input-container">
          <label className="generate-boarder-label">Occasion: </label>
          <input
            className="sketch-input"
            type="text"
            placeholder="Occasion (e.g. birthday)"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
          />
        </div>

        <div className="generate-boarder-input-container">
          <label className="generate-boarder-label">Vibe: </label>
          <input
            className="sketch-input"
            type="text"
            placeholder="Vibe (e.g. vintage)"
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
          />
        </div>

        <div className="generate-boarder-input-container">
          <label className="generate-boarder-label">Color: </label>
          <input
            className="sketch-input"
            type="text"
            placeholder="Color (e.g. warm tones)"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>

        {status === "error" && <p className="modal-error">{errorMsg}</p>}

        <div className="modal-actions">
          <SketchButton onClick={onClose}>Cancel</SketchButton>
          <SketchButton
            variant="primary"
            onClick={handleGenerate}
            disabled={status === "loading" || !code.trim()}
          >
            {status === "loading" ? "Generating..." : "Generate"}
          </SketchButton>
        </div>
      </div>
    </div>
  );
};

export default BorderModal;
