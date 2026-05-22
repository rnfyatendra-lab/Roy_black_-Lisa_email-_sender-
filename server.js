const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json({
  limit: "10mb"
}));

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

const BATCH_SIZE = 5;
const BATCH_DELAY = 300;
const DAILY_LIMIT = 500;

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

    const transporter = nodemailer.createTransport({

      host: "smtp.gmail.com",

      port: 465,

      secure: true,

      auth: {
        user: gmail,
        pass: appPassword
      },

      tls: {
        rejectUnauthorized: false
      }

    });

    try {

      await transporter.verify();

    } catch (err) {

      console.log(err);

      return res.json({
        success: false,
        popup: "❌ Wrong Gmail Or App Password"
      });
    }

    let emails = recipients
      .split(/[\n,]+/)
      .map(e => e.trim())
      .filter(Boolean);

    emails = [...new Set(emails)];

    emails = emails.filter(valid);

    if (emails.length === 0) {

      return res.json({
        success: false,
        popup: "❌ Invalid Recipient Emails"
      });
    }

    if (emails.length > DAILY_LIMIT) {

      return res.json({
        success: false,
        popup: `❌ Daily Limit ${DAILY_LIMIT}`
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

              from: `"${senderName || "Mailer"}" <${gmail}>`,

              to: email,

              subject: subject,

              text: message,

              html: `
                <div style="
                  font-family:Arial;
                  padding:20px;
                  line-height:1.7;
                ">
                  ${message.replace(/\n/g, "<br>")}
                </div>
              `

            });

            sent++;

            console.log("✅ Sent:", email);

          } catch (err) {

            failed++;

            console.log("❌ Failed:", email);

            console.log(err.message);
          }

        })

      );

      await sleep(BATCH_DELAY);
    }

    if (sent === 0) {

      return res.json({
        success: false,
        popup: "❌ Gmail Rejected Sending"
      });
    }

    return res.json({
      success: true,
      popup: `✅ Mail Sent ${sent}`,
      sent,
      failed
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

  console.log(`
  🚀 Server Running
  PORT: ${PORT}
  `);

});
