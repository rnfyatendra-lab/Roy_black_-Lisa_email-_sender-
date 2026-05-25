try {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmail,
      pass: appPassword.replace(/\s/g, "")
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
  });

  await transporter.verify();

  await transporter.sendMail({
    from: gmail,
    to,
    subject,
    text: message
  });

  res.json({
    success: true,
    message: "Mail Sent"
  });

} catch (err) {

  console.log(err);

  res.status(500).json({
    success: false,
    error: err.message
  });
}
