const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
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

    if (
      !gmail ||
      !appPassword ||
      !subject ||
      !message ||
      !recipients
    ) {

      return res.json({
        success: false,
        popup: "❌ Fill All Fields"
      });
    }

    // APP PASSWORD CLEAN
    const cleanPassword = appPassword.replace(/\s/g, "");

    // SMTP
    const transporter = nodemailer.createTransport({

      host: "smtp.gmail.com",

      port: 465,

      secure: true,

      auth: {
        user: gmail.trim(),
        pass: cleanPassword
      }

    });

    // LOGIN TEST
    try {

      await transporter.verify();

    } catch (err) {

      console.log(err);

      return res.json({
        success: false,
        popup: "❌ Wrong Gmail Or App Password"
      });
    }

    // EMAIL LIST
    const emails = recipients
      .split(/[\n,]+/)
      .map(e => e.trim())
      .filter(Boolean);

    if (emails.length === 0) {

      return res.json({
        success: false,
        popup: "❌ Invalid Recipients"
      });
    }

    let sent = 0;

    // SIMPLE SEND
    for (const email of emails) {

      try {

        await transporter.sendMail({

          from: `"${senderName || gmail}" <${gmail}>`,

          to: email,

          subject: subject,

          text: message,

          html: `
            <div style="font-family:Arial;padding:20px;">
              ${message.replace(/\n/g, "<br>")}
            </div>
          `
        });

        sent++;

        console.log("MAIL SENT:", email);

      } catch (err) {

        console.log(err.message);
      }
    }

    return res.json({
      success: true,
      popup: `✅ Mail Sent ${sent}`
    });

  } catch (err) {

    console.log(err);

    return res.json({
      success: false,
      popup: "❌ Server Error"
    });
  }

});

app.listen(PORT, () => {
  console.log("🚀 Server Running On Port " + PORT);
});
