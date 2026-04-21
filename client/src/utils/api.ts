interface SaveStripResponse {
  sessionId: number;
  stripUrl: string;
}

interface EmailResponse {
  success: boolean;
}

interface BorderResponse {
  borderDataUrl: string;
  error?: string;
}

export const saveStrip = async (stripDataUrl: string): Promise<SaveStripResponse> => {
  const res = await fetch("/api/photos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stripDataUrl }),
  });
  if (!res.ok) throw new Error("Failed to save strip");
  return res.json() as Promise<SaveStripResponse>;
};

export const sendEmail = async (email: string, stripDataUrl: string): Promise<EmailResponse> => {
  const res = await fetch("/api/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, stripDataUrl }),
  });
  if (!res.ok) throw new Error("Failed to send email");
  return res.json() as Promise<EmailResponse>;
};

export const generateBorder = async (
  code: string,
  prompt: string,
  sessionId?: number,
): Promise<BorderResponse> => {
  const res = await fetch("/api/border", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, prompt, sessionId }),
  });
  return res.json() as Promise<BorderResponse>;
};
