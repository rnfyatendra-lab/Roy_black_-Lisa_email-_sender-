const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/send-email", async (req, res) => {

  try {

    const {
      senderName,
      gmail,
      appPassword,
      subject,
      message,
      emails
    } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmail,
        pass: appPassword
      }
    });

    const emailList = emails
      .split("\n")
      .map(e => e.trim())
      .filter(Boolean);

    let sent = 0;
    let failed = 0;

    for (const email of emailList) {

      try {

        await transporter.sendMail({
          from: `"${senderName}" <${gmail}>`,
          to: email,
          subject: subject,
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
  console.log("Server Started");
});
