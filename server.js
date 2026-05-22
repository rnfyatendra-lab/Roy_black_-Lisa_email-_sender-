require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3000;

// Validate ENV
if (!process.env.EMAIL || !process.env.APP_PASSWORD) {
  console.log("❌ EMAIL or APP_PASSWORD missing");
  process.exit(1);
}

// Gmail Transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD
  }
});

// Verify SMTP
transporter.verify((error) => {
  if (error) {
    console.log("❌ SMTP Error:");
    console.log(error.message);
  } else {
    console.log("✅ SMTP Connected");
  }
});

// Read Emails
function getEmails() {
  try {
    return fs
      .readFileSync("emails.txt", "utf-8")
      .split("\n")
      .map(email => email.trim())
      .filter(Boolean);

  } catch (err) {
    console.log("❌ emails.txt missing");
    return [];
  }
}

// Read HTML Template
function getTemplate() {
  try {
    return fs.readFileSync("template.html", "utf-8");

  } catch (err) {
    console.log("❌ template.html missing");

    return `
      <h2>Hello!</h2>
      <p>This is a test email.</p>
    `;
  }
}

// Send Emails
async function sendEmails() {

  const emails = getEmails();
  const html = getTemplate();

  if (emails.length === 0) {
    console.log("❌ No emails found");
    return;
  }

  console.log(`🚀 Starting ${emails.length} emails`);

  for (const email of emails) {

    try {

      await transporter.sendMail({
        from: `"My Company" <${process.env.EMAIL}>`,
        to: email,
        subject: "Test Email",
        html: html
      });

      console.log(`✅ Sent: ${email}`);

      // Safe delay
      await new Promise(resolve => setTimeout(resolve, 5000));

    } catch (err) {

      console.log(`❌ Failed: ${email}`);
      console.log(err.message);
    }
  }

  console.log("✅ All emails processed");
}

// Home Route
app.get("/", (req, res) => {
  res.send("Railway Bulk Mail Server Running");
});

// Send Route
app.get("/send", async (req, res) => {

  sendEmails();

  res.send("🚀 Email Sending Started");
});

// Health Route
app.get("/health", (req, res) => {
  res.json({
    status: "ok"
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
