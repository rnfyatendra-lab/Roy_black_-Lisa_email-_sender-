const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/send-email", async (req, res) => {
  try {
    const {
      senderName,
      senderEmail,
      appPassword,
      subject,
      message,
      recipients
    } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: senderEmail,
        pass: appPassword
      }
    });

    let sent = 0;
    let failed = 0;

    for (const email of recipients) {
      try {
        await transporter.sendMail({
          from: `"${senderName}" <${senderEmail}>`,
          to: email,
          subject,
          text: message
        });

        sent++;
      } catch (err) {
        failed++;
      }
    }

    res.json({
      success: true,
      sent,
      failed
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server Running");
});
