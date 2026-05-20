const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.post("/send-email", async (req, res) => {
  try {
    const {
      senderName,
      senderEmail,
      appPassword,
      subject,
      message,
      recipients,
    } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: senderEmail,
        pass: appPassword,
      },
    });

    let success = 0;
    let failed = 0;

    for (const email of recipients) {
      try {
        await transporter.sendMail({
          from: `"${senderName}" <${senderEmail}>`,
          to: email,
          subject: subject,
          text: message,
        });

        success++;
      } catch (err) {
        failed++;
      }
    }

    res.json({
      success: true,
      sent: success,
      failed: failed,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
