import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/send", async (req, res) => {
  try {
    const {
      senderName,
      gmail,
      appPassword,
      subject,
      message,
      emails
    } = req.body;

    if (
      !gmail ||
      !appPassword ||
      !subject ||
      !message ||
      !emails
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmail,
        pass: appPassword
      }
    });

    const emailList = emails
      .split(/[\n,]+/)
      .map((e) => e.trim())
      .filter(Boolean);

    let sent = 0;
    let failed = 0;

    for (const email of emailList) {
      try {
        await transporter.sendMail({
          from: `"${senderName}" <${gmail}>`,
          to: email,
          subject,
          text: message
        });

        sent++;

        await new Promise((resolve) =>
          setTimeout(resolve, 2000)
        );
      } catch (err) {
        failed++;
      }
    }

    res.json({
      success: true,
      sent,
      failed
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
