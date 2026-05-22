const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

const BATCH_SIZE = 5;
const BATCH_DELAY = 300;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

    const cleanPass = appPassword.replace(/\s/g, "");

    // FIXED SMTP
    const transporter = nodemailer.createTransport({

      host: "smtp.gmail.com",
      port: 465,
      secure: true,

      auth: {
        user: gmail,
        pass: cleanPass
      },

      tls: {
        rejectUnauthorized: false
      }

    });

    // FAST LOGIN CHECK
    try {

      await transporter.verify();

    } catch (err) {

      console.log("LOGIN ERROR:", err);

      return res.json({
        success: false,
        popup: "❌ Wrong Gmail Or App Password"
      });
    }

    const emails = recipients
      .split(/[\n,]+/)
      .map(e => e.trim())
      .filter(e => valid(e));

    if (emails.length === 0) {

      return res.json({
        success: false,
        popup: "❌ Invalid Recipient"
      });
    }

    let sent = 0;
    let failed = 0;

    for (let i = 0; i < emails.length; i += BATCH_SIZE) {

      const batch = emails.slice(i, i + BATCH_SIZE);

      await Promise.all(

        batch.map(async (email) => {

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

            console.log("SENT:", email);

          } catch (err) {

            failed++;

            console.log("MAIL ERROR:", err.message);
          }

        })

      );

      await sleep(BATCH_DELAY);
    }

    if (sent === 0) {

      return res.json({
        success: false,
        popup: "❌ Gmail Blocked Sending"
      });
    }

    return res.json({
      success: true,
      popup: `✅ Mail Sent ${sent}`,
      sent,
      failed
    });

  } catch (err) {

    console.log("SERVER ERROR:", err);

    return res.json({
      success: false,
      popup: "❌ Server Error"
    });
  }

});

app.listen(PORT, () => {
  console.log("🚀 Server Running");
});
