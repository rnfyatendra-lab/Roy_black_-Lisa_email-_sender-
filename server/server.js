import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'

const app = express()

app.use(cors())
app.use(express.json())

app.post('/send-email', async (req, res) => {

  const {
    gmail,
    password,
    senderName,
    to,
    subject,
    message,
  } = req.body

  try {

    const transporter = nodemailer.createTransport({
      service: 'gmail',

      auth: {
        user: gmail,
        pass: password,
      },
    })

    await transporter.sendMail({
      from: `${senderName} <${gmail}>`,
      to,
      subject,
      text: message,
    })

    res.json({ success: true })

  } catch (error) {

    console.log(error)

    res.json({ success: false })
  }
})

app.listen(5000, () => {
  console.log('Server running on port 5000')
})
