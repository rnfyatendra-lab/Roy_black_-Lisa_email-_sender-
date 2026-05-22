const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function valid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/send", async (req, res) => {

  try {

    const {
      senderName,
      gmail,
      appPassword,
      subject,
      message,
      recipients
    } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmail,
        pass: appPassword
      }
    });

    await transporter.verify();

    const list = recipients
      .split(/[\n,]+/)
      .map(e => e.trim())
      .filter(Boolean);

    const emails = [...new Set(list)];

    let sent = 0;
    let failed = 0;

    for (const email of emails) {

      if (!valid(email)) continue;

      try {

        await transporter.sendMail({
          from: `"${senderName}" <${gmail}>`,
          to: email,
          subject: subject,
          html: `
            <div style="font-family:Arial;padding:20px;">
              ${message.replace(/\n/g, "<br>")}
            </div>
          `
        });

        console.log("Sent:", email);

        sent++;

        await sleep(2000);

      } catch (err) {

        console.log(err.message);

        failed++;
      }
    }

    res.json({
      success: true,
      sent,
      failed
    });

  } catch (err) {

    res.json({
      success: false,
      message: err.message
    });
  }

});

app.listen(PORT, () => {
  console.log("Server Running");
});
