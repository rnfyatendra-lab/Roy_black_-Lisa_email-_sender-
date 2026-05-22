require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3000;

// Gmail Transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD
  }
});

// Read Emails
function getEmails() {
  return fs
    .readFileSync("emails.txt", "utf-8")
    .split("\n")
    .map(email => email.trim())
    .filter(Boolean);
}

// Read HTML Template
function getTemplate() {
  return fs.readFileSync("template.html", "utf-8");
}

// Send Emails
async function sendEmails() {
  const emails = getEmails();
  const html = getTemplate();

  for (const email of emails) {
    try {
      await transporter.sendMail({
        from: `"My Company" <${process.env.EMAIL}>`,
        to: email,
        subject: "Hello From Railway",
        html: html
      });

      console.log(`✅ Sent: ${email}`);

      // Delay
      await new Promise(resolve => setTimeout(resolve, 3000));

    } catch (err) {
      console.log(`❌ Failed: ${email}`);
      console.log(err.message);
    }
  }
}

// Home Route
app.get("/", (req, res) => {
  res.send("Railway Bulk Mail Server Running");
});

// Send Route
app.get("/send", async (req, res) => {
  sendEmails();
  res.send("Email Sending Started");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server Running On Port ${PORT}`);
});
