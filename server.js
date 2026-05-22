const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

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

    const cleanPass = appPassword.replace(/\s+/g, "");

    const transporter = nodemailer.createTransport({

      host: "smtp.gmail.com",
      port: 465,
      secure: true,

      auth: {
        user: gmail,
        pass: cleanPass
      },

      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000

    });

    try {

      await transporter.verify();

    } catch (err) {

      console.log(err);

      if (
        err.message.includes("Username") ||
        err.message.includes("Password")
      ) {

        return res.json({
          success: false,
          popup: "❌ Wrong Gmail Or App Password"
        });
      }

      if (
        err.message.includes("Invalid login") ||
        err.message.includes("534")
      ) {

        return res.json({
          success: false,
          popup: "❌ Gmail Login Blocked"
        });
      }

      return res.json({
        success: false,
        popup: "❌ Gmail SMTP Error"
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

    for (const email of emails) {

      try {

        await transporter.sendMail({

          from: `"${senderName}" <${gmail}>`,
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

        console.log("Sent:", email);

      } catch (err) {

        failed++;

        console.log(err.message);
      }
    }

    return res.json({

      success: true,

      popup: `✅ Sent: ${sent} | Failed: ${failed}`,

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
  console.log("🚀 Server Running");
});
