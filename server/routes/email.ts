import { Router, type Request, type Response } from "express";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import { readFileSync } from "fs";
import { join } from "path";

const router = Router();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

router.post("/", async (req: Request, res: Response) => {
  console.log(req);
  const { email, stripDataUrl } = req.body;

  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: SENDER_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const emailHtml = readFileSync(join(import.meta.dirname, "../template/email.html"), "utf-8");

    const mailOptions = {
      from: `Maigu Mango <${SENDER_EMAIL}>`,
      to: email,
      subject: "Your picture has arrived",
      html: emailHtml,
      attachments: [
        {
          filename: "photo.jpg",
          path: stripDataUrl,
          cid: "logo@nodemailer",
        },
      ],
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:", result.response);
    res.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    res.json({ success: false });
  }
});

export default router;
