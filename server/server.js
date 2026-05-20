const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.post("/send-email", async (req, res) => {
  try {
    const {
      senderName,
      gmail,
      appPassword,
      subject,
      message,
      recipients,
    } = req.body;

    if (
      !gmail ||
      !appPassword ||
      !subject ||
      !message ||
      !recipients
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing fields",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmail,
        pass: appPassword,
      },
    });

    await transporter.verify();

    let sent = 0;
    let failed = 0;

    for (const email of recipients) {
      try {
        await transporter.sendMail({
          from: `"${senderName}" <${gmail}>`,
          to: email,
          subject: subject,
          text: message,
        });

        sent++;

        await new Promise((resolve) =>
          setTimeout(resolve, 500)
        );
      } catch (err) {
        console.log("MAIL FAIL:", err.message);
        failed++;
      }
    }

    res.json({
      success: true,
      sent,
      failed,
    });
  } catch (err) {
    console.log("SERVER ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});
