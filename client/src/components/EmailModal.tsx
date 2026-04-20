import React, { useState } from "react";
import { sendEmail } from "../utils/api";
import SketchButton from "./SketchButton";

type Status = "idle" | "sending" | "success" | "error";

interface EmailModalProps {
  stripDataUrl: string;
  onClose: () => void;
}

const EmailModal = ({ stripDataUrl, onClose }: EmailModalProps) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSend = async () => {
    if (!email) return;
    setStatus("sending");
    try {
      await sendEmail(email, stripDataUrl);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card sketch-card" onClick={(e) => e.stopPropagation()}>
        {status === "success" ? (
          <>
            <p className="modal-success">✉️ Sent! Check your inbox.</p>
            <SketchButton onClick={onClose}>Close</SketchButton>
          </>
        ) : (
          <>
            <h2>Send to email</h2>
            <input
              className="sketch-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            {status === "error" && <p className="modal-error">Something went wrong. Try again.</p>}
            <div className="modal-actions">
              <SketchButton onClick={onClose}>Cancel</SketchButton>
              <SketchButton variant="primary" onClick={handleSend} disabled={status === "sending"}>
                {status === "sending" ? "Sending..." : "Send"}
              </SketchButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailModal;
