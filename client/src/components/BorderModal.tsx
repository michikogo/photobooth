import React, { useState } from "react";
import { generateBorder, ApiError } from "../utils/api";
import type { SavedBorder } from "../utils/api";
import SketchButton from "./SketchButton";

type Status = "idle" | "loading" | "error";

interface BorderModalProps {
  sessionId?: number;
  initialCode?: string;
  onApply: (borderUrl: string, newBorder?: SavedBorder, usedCode?: string) => void;
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

  const handleGenerate = async () => {
    if (!code.trim()) return;
    setStatus("loading");
    setErrorMsg("");

    const prompt = `photo booth border frame, ${occasion}, ${vibe}, ${color}, decorative, no people`;
    try {
      const data = await generateBorder(code.trim().toUpperCase(), prompt, sessionId);
      const newBorder: SavedBorder = {
        id: data.borderId,
        sessionId: sessionId ?? null,
        borderDataUrl: data.borderDataUrl,
        borderPath: data.borderPath,
        prompt,
        createdAt: new Date().toISOString(),
      };
      onApply(data.borderDataUrl, newBorder, code.trim().toUpperCase());
    } catch (err) {
      const httpStatus = err instanceof ApiError ? err.status : 0;
      setErrorMsg(ERROR_MESSAGES[httpStatus] ?? "Something went wrong. Try again.");
      setStatus("error");
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card sketch-card" onClick={(e) => e.stopPropagation()}>
        <h2>Generate AI Border</h2>

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
            placeholder="e.g. birthday"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
          />
        </div>

        <div className="generate-boarder-input-container">
          <label className="generate-boarder-label">Vibe: </label>
          <input
            className="sketch-input"
            type="text"
            placeholder="e.g. vintage"
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
          />
        </div>

        <div className="generate-boarder-input-container">
          <label className="generate-boarder-label">Color: </label>
          <input
            className="sketch-input"
            type="text"
            placeholder="e.g. warm tones"
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
