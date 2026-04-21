import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { compositeStrip } from "../utils/compositeStrip";
import { saveStrip } from "../utils/api";
import EmailModal from "../components/EmailModal";
import BorderModal from "../components/BorderModal";
import SketchButton from "../components/SketchButton";

const StripPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const photos = (state as { photos?: string[] } | null)?.photos ?? [];
  const photosRef = useRef(photos);
  const navigateRef = useRef(navigate);

  const [stripDataUrl, setStripDataUrl] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<number | undefined>(undefined);
  const [borderDataUrl, setBorderDataUrl] = useState<string | null>(null);
  const [lastBorderCode, setLastBorderCode] = useState<string | undefined>(undefined);
  const [showEmail, setShowEmail] = useState(false);
  const [showBorder, setShowBorder] = useState(false);

  useEffect(() => {
    const currentPhotos = photosRef.current;
    if (!currentPhotos.length) {
      navigateRef.current("/");
      return;
    }

    compositeStrip(currentPhotos).then((dataUrl) => {
      setStripDataUrl(dataUrl);
      saveStrip(dataUrl)
        .then((res) => setSessionId(res.sessionId))
        .catch(() => {});
    });
  }, []);

  const handleDownload = () => {
    if (!stripDataUrl) return;
    const a = document.createElement("a");
    a.href = stripDataUrl;
    a.download = "photobooth-strip.png";
    a.click();
  };

  const handleApplyBorder = (url: string, usedCode?: string) => {
    setBorderDataUrl(url);
    if (usedCode) setLastBorderCode(usedCode);
    setShowBorder(false);
    compositeStrip(photosRef.current, { borderDataUrl: url }).then(setStripDataUrl);
  };

  return (
    <div className="page strip-page">
      <div className="strip-wrap">
        {stripDataUrl ? (
          <img src={stripDataUrl} alt="Photo strip" className="strip-img" />
        ) : (
          <div className="strip-loading">Developing your strip...</div>
        )}
      </div>

      <div className="strip-actions">
        <h2 className="strip-title">Your Strip</h2>
        <SketchButton onClick={handleDownload} disabled={!stripDataUrl}>
          ⬇ Download
        </SketchButton>
        <SketchButton onClick={() => setShowEmail(true)} disabled={!stripDataUrl}>
          ✉ Email
        </SketchButton>
        <SketchButton onClick={() => setShowBorder(true)} disabled={!stripDataUrl}>
          {borderDataUrl ? "✦ Regenerate Border" : "✦ Generate AI Border"}
        </SketchButton>
        <SketchButton onClick={() => navigate("/")}>← Back</SketchButton>
      </div>

      {showEmail && stripDataUrl && (
        <EmailModal stripDataUrl={stripDataUrl} onClose={() => setShowEmail(false)} />
      )}

      {showBorder && (
        <BorderModal
          sessionId={sessionId}
          initialCode={lastBorderCode}
          onApply={handleApplyBorder}
          onClose={() => setShowBorder(false)}
        />
      )}
    </div>
  );
};

export default StripPage;
