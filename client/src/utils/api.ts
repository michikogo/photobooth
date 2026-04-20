interface SaveStripResponse {
  sessionId: number;
  stripUrl: string;
}

interface EmailResponse {
  success: boolean;
}

export async function saveStrip(stripDataUrl: string): Promise<SaveStripResponse> {
  const res = await fetch("/api/photos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stripDataUrl }),
  });
  if (!res.ok) throw new Error("Failed to save strip");
  return res.json() as Promise<SaveStripResponse>;
}

export async function sendEmail(email: string, stripDataUrl: string): Promise<EmailResponse> {
  const res = await fetch("/api/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, stripDataUrl }),
  });
  if (!res.ok) throw new Error("Failed to send email");
  return res.json() as Promise<EmailResponse>;
}
