require("dotenv").config();

const express = require("express");
const nodemailer = require("nodemailer");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3000;

// Validate ENV
if (!process.env.EMAIL || !process.env.APP_PASSWORD) {
  console.log("❌ Missing EMAIL or APP_PASSWORD");
  process.exit(1);
}

// Create Transporter
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
    console.log("❌ SMTP Connection Failed");
    console.log(error.message);
  } else {
    console.log("✅ SMTP Connected");
  }
});

// Email Validation
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Read Emails
function getEmails() {
  try {

    const emails = fs
      .readFileSync("emails.txt", "utf-8")
      .split("\n")
      .map(email => email.trim())
      .filter(Boolean);

    // Remove duplicates
    return [...new Set(emails)];

  } catch (err) {

    console.log("❌ emails.txt not found");
    return [];
  }
}

// Read Template
function getTemplate() {

  try {

    return fs.readFileSync("template.html", "utf-8");

  } catch (err) {

    console.log("❌ template.html not found");

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

  console.log(`🚀 Total Emails: ${emails.length}`);

  let success = 0;
  let failed = 0;

  for (const email of emails) {

    // Validate email
    if (!isValidEmail(email)) {
      console.log(`⚠️ Invalid Email Skipped: ${email}`);
      continue;
    }

    try {

      await transporter.sendMail({
        from: `"My Company" <${process.env.EMAIL}>`,
        to: email,
        subject: "Hello",
        html: html
      });

      success++;

      console.log(`✅ Sent: ${email}`);

      // Safe Delay
      await new Promise(resolve => setTimeout(resolve, 5000));

    } catch (err) {

      failed++;

      console.log(`❌ Failed: ${email}`);
      console.log(err.message);
    }
  }

  console.log("=================================");
  console.log(`✅ Success: ${success}`);
  console.log(`❌ Failed: ${failed}`);
  console.log("=================================");
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
    status: "ok",
    smtp: "connected"
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server Running On Port ${PORT}`);
});
