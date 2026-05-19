// FILE NAME: server/server.js

import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();

app.use(cors());
app.use(express.json());

const SESSION_TIME = 60 * 60 * 1000;

const BATCH_SIZE = 4;
const BATCH_DELAY = 400;

const DAILY_LIMIT = 600;

let sentToday = 0;
let sessionStart = Date.now();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.post("/send-email", async (req, res) => {
  const {
    gmail,
    password,
    senderName,
    emails,
    subject,
    message,
  } = req.body;

  try {
    if (!gmail || !password || !emails?.length) {
      return res.json({
        success: false,
        message: "Missing fields",
      });
    }

    const now = Date.now();

    if (now - sessionStart > SESSION_TIME) {
      sessionStart = now;
      sentToday = 0;
    }

    if (sentToday >= DAILY_LIMIT) {
      return res.json({
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

            console.log(`Sent -> ${email}`);
          } catch (error) {
            failed++;

            console.log(`Failed -> ${email}`);
          }
        })
      );

      await delay(BATCH_DELAY);
    }

    transporter.close();

    res.json({
      success: true,
      sent,
      failed,
    });
  } catch (error) {
    console.log(error);

    res.json({
      success: false,
      message: "Server Error",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
