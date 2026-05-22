import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(cors());

app.use(express.json({
  limit: "10mb"
}));

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

app.use(express.static(__dirname));

app.get("/", (req, res) => {

  res.sendFile(
    path.join(__dirname, "index.html")
  );
});



/* SAFE SETTINGS */

const PARALLEL = 2;

const DELAY_MS = 400;

const HOURLY_LIMIT = 27;

let sentThisHour = 0;

setInterval(() => {

  sentThisHour = 0;

}, 60 * 60 * 1000);




app.post("/send", async (req, res) => {

  try {

    const {
      senderName,
      gmail,
      appPassword,
      subject,
      message,
      emails
    } = req.body;

    if (
      !senderName ||
      !gmail ||
      !appPassword ||
      !subject ||
      !message ||
      !emails
    ) {

      return res.status(400).json({

        success: false,

        message:
          "All fields required"
      });
    }

    const emailList = emails

      .split(/[\n,]+/)

      .map(email => email.trim())

      .filter(Boolean);



    if (
      sentThisHour + emailList.length >
      HOURLY_LIMIT
    ) {

      return res.status(429).json({

        success: false,

        message:
          "Hourly limit reached"
      });
    }



    const transporter =
      nodemailer.createTransport({

        service: "gmail",

        pool: true,

        maxConnections: 1,

        auth: {

          user: gmail,

          pass: appPassword
        }
      });



    let sent = 0;

    let failed = 0;



    for (
      let i = 0;
      i < emailList.length;
      i += PARALLEL
    ) {

      const batch =
        emailList.slice(
          i,
          i + PARALLEL
        );



      await Promise.all(

        batch.map(async (email) => {

          try {

            await transporter.sendMail({

              from:
                `"${senderName}" <${gmail}>`,

              to: email,

              subject: subject,

              text: message,

              headers: {

                "X-Mailer":
                  "Professional Business Mail",

                "X-Priority":
                  "3",

                "List-Unsubscribe":
                  `<mailto:${gmail}>`
              }

            });

            sent++;

            sentThisHour++;

            console.log(
              "Sent:",
              email
            );

          } catch (err) {

            failed++;

            console.log(
              "Failed:",
              email
            );
          }

        })

      );



      await new Promise(resolve =>

        setTimeout(
          resolve,
          DELAY_MS
        )

      );
    }



    transporter.close();



    return res.json({

      success: true,

      sent,

      failed
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message:
        "Server Error"
    });
  }
});



const PORT =
  process.env.PORT || 10000;



app.listen(PORT, () => {

  console.log(
    `Server Running On ${PORT}`
  );
});
