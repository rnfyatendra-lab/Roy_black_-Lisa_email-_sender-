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

    const transporter =
      nodemailer.createTransport({

        service: "gmail",

        auth: {
          user: gmail,
          pass: appPassword
        }
      });

    await transporter.sendMail({

      from: `"${senderName}" <${gmail}>`,

      to: emails,

      subject: subject,

      text: message,

      headers: {
        "X-Priority": "3",
        "X-Mailer": "Professional Mailer"
      }

    });

    res.json({
      success: true
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server Running ${PORT}`);
});
