const sendBtn = document.getElementById("sendBtn");
const result = document.getElementById("result");

sendBtn.addEventListener("click", async () => {

  result.innerHTML = "Sending...";

  const data = {
    senderName: document.getElementById("senderName").value,
    gmail: document.getElementById("gmail").value,
    appPassword: document.getElementById("appPassword").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value,
    recipients: document.getElementById("recipients").value
  };

  try {

    const response = await fetch("/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const resultData = await response.json();

    if (resultData.success) {

      result.innerHTML = `
        ✅ Sent: ${resultData.sent}<br>
        ❌ Failed: ${resultData.failed}
      `;

    } else {

      result.innerHTML = `❌ ${resultData.message}`;
    }

  } catch (err) {

    result.innerHTML = err.message;
  }
});
