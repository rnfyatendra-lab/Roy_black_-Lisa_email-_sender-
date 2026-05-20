async function sendEmails() {

  const senderName =
    document.getElementById("senderName").value;

  const gmail =
    document.getElementById("gmail").value;

  const appPassword =
    document.getElementById("appPassword").value;

  const subject =
    document.getElementById("subject").value;

  const message =
    document.getElementById("message").value;

  const emails =
    document.getElementById("emails").value;

  const total =
    emails.split("\n").filter(Boolean).length;

  document.getElementById("total").innerText = total;

  document.getElementById("status").innerText =
    "Sending...";

  try {

    const response = await fetch("/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        senderName,
        gmail,
        appPassword,
        subject,
        message,
        emails
      })
    });

    const data = await response.json();

    if (data.success) {

      document.getElementById("sent").innerText =
        data.sent;

      document.getElementById("failed").innerText =
        data.failed;

      document.getElementById("status").innerText =
        "Completed";

    } else {

      document.getElementById("status").innerText =
        "Server Error";
    }

  } catch (err) {

    document.getElementById("status").innerText =
      "Server Error";
  }
}
