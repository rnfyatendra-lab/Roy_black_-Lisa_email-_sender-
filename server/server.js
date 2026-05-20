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

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmail,
        pass: appPassword,
      },
    });

    let sent = 0;
    let failed = 0;

    for (const email of recipients) {
      try {
        await transporter.sendMail({
          from: `"${senderName}" <${gmail}>`,
          to: email,
          subject,
          text: message,
        });

        sent++;

        await new Promise((resolve) =>
          setTimeout(resolve, 400)
        );
      } catch (err) {
        failed++;
      }
    }

    res.json({
      success: true,
      sent,
      failed,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
