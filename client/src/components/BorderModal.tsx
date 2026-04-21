import React, { useState } from "react";
import { generateBorder } from "../utils/api";
import SketchButton from "./SketchButton";

type Status = "idle" | "loading" | "error";

interface BorderModalProps {
  sessionId?: number;
  onApply: (borderDataUrl: string) => void;
  onClose: () => void;
}

const ERROR_MESSAGES: Record<number, string> = {
  404: "Code not found.",
  409: "Code has already been used.",
  410: "Code has expired.",
};

const BorderModal = ({ sessionId, onApply, onClose }: BorderModalProps) => {
  const [code, setCode] = useState("");
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
    const res = await fetch("/api/border", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code.trim().toUpperCase(), prompt, sessionId }),
    });

    if (!res.ok) {
      setErrorMsg(ERROR_MESSAGES[res.status] ?? "Something went wrong. Try again.");
      setStatus("error");
      return;
    }

    const data = (await res.json()) as { borderDataUrl: string };
    onApply(data.borderDataUrl);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card sketch-card" onClick={(e) => e.stopPropagation()}>
        <h2>Generate AI Border</h2>

        <input
          className="sketch-input"
          type="text"
          placeholder="Enter your code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <input
          className="sketch-input"
          type="text"
          placeholder="Occasion (e.g. birthday)"
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
        />

        <input
          className="sketch-input"
          type="text"
          placeholder="Vibe (e.g. vintage)"
          value={vibe}
          onChange={(e) => setVibe(e.target.value)}
        />

        <input
          className="sketch-input"
          type="text"
          placeholder="Color (e.g. warm tones)"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

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
