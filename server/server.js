// FILE NAME: server/server.js

import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();

app.use(cors());

app.use(
  express.json({
    limit: "10mb",
  })
);

const PORT = process.env.PORT || 5000;

const SESSION_TIME = 60 * 60 * 1000;

const BATCH_SIZE = 4;
const BATCH_DELAY = 400;

const DAILY_LIMIT = 600;

let sentToday = 0;
let sessionStart = Date.now();

const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.post("/send-email", async (req, res) => {
  try {
    const {
      gmail,
      password,
      senderName,
      emails,
      subject,
      message,
    } = req.body;

    if (
      !gmail ||
      !password ||
      !senderName ||
      !subject ||
      !message ||
      !emails ||
      emails.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const now = Date.now();

    if (now - sessionStart > SESSION_TIME) {
      sentToday = 0;
      sessionStart = now;
    }

    if (sentToday >= DAILY_LIMIT) {
      return res.status(429).json({
        success: false,
        message: "Daily limit reached",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: gmail,
        pass: password,
      },

      pool: true,
      maxConnections: 4,
      maxMessages: Infinity,
    });

    await transporter.verify();

    let sent = 0;
    let failed = 0;

    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE);

      await Promise.all(
        batch.map(async (email) => {
          try {
            await transporter.sendMail({
              from: `${senderName} <${gmail}>`,
              to: email,
              subject,
              text: message,
            });

            sent++;
            sentToday++;

            console.log(`Sent: ${email}`);
          } catch (err) {
            failed++;

            console.log(`Failed: ${email}`);
          }
        })
      );

      await delay(BATCH_DELAY);
    }

    transporter.close();

    return res.json({
      success: true,
      sent,
      failed,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
