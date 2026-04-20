import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { compositeStrip } from "../utils/compositeStrip";
import { saveStrip } from "../utils/api";
import EmailModal from "../components/EmailModal";
import SketchButton from "../components/SketchButton";

const StripPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const photos = (state as { photos?: string[] } | null)?.photos ?? [];
  const photosRef = useRef(photos);
  const navigateRef = useRef(navigate);

  const [stripDataUrl, setStripDataUrl] = useState<string | null>(null);
  const [showEmail, setShowEmail] = useState(false);

  useEffect(() => {
    const currentPhotos = photosRef.current;
    if (!currentPhotos.length) {
      navigateRef.current("/");
      return;
    }

    compositeStrip(currentPhotos).then((dataUrl) => {
      setStripDataUrl(dataUrl);
      saveStrip(dataUrl).catch(() => {});
    });
  }, []);

  const handleDownload = () => {
    if (!stripDataUrl) return;
    const a = document.createElement("a");
    a.href = stripDataUrl;
    a.download = "photobooth-strip.png";
    a.click();
  };

  return (
    <div className="page strip-page">
      <h2>Your Strip</h2>

      <div className="strip-wrap">
        {stripDataUrl ? (
          <img src={stripDataUrl} alt="Photo strip" className="strip-img" />
        ) : (
          <div className="strip-loading">Developing your strip...</div>
        )}
      </div>

      <div className="strip-actions">
        <SketchButton onClick={handleDownload} disabled={!stripDataUrl}>
          ⬇ Download
        </SketchButton>
        <SketchButton onClick={() => setShowEmail(true)} disabled={!stripDataUrl}>
          ✉ Email
        </SketchButton>
        <SketchButton onClick={() => navigate("/")}>← Back</SketchButton>
      </div>

      {showEmail && stripDataUrl && (
        <EmailModal stripDataUrl={stripDataUrl} onClose={() => setShowEmail(false)} />
      )}
    </div>
  );
};

export default StripPage;
