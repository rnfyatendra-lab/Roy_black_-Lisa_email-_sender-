import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Backend Running...");
});

app.post("/send-email", async (req, res) => {
  try {
    const {
      gmail,
      password,
      senderName,
      emails,
      subject,
      message,
    } = req.body;

    if (
      !gmail ||
      !password ||
      !senderName ||
      !emails ||
      emails.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing Fields",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: gmail,
        pass: password,
      },
    });

    await transporter.verify();

    let sent = 0;
    let failed = 0;

    for (const email of emails) {
      try {
        await transporter.sendMail({
          from: `${senderName} <${gmail}>`,
          to: email,
          subject,
          text: message,
        });

        sent++;

        console.log("Sent:", email);
      } catch (err) {
        failed++;

        console.log("Failed:", email);
      }
    }

    return res.json({
      success: true,
      sent,
      failed,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server Running On ${PORT}`);
});
