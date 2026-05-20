const HOURLY_LIMIT = 28;
const PARALLEL = 2;
const DELAY_MS = 4500;

let hourlyStats = {
  count: 0
};

setInterval(() => {
  hourlyStats.count = 0;
}, 60 * 60 * 1000);

async function sendEmails() {

  const sendBtn =
    document.querySelector(".send-btn");

  const status =
    document.getElementById("status");

  const senderName =
    document.getElementById("senderName").value.trim();

  const gmail =
    document.getElementById("gmail").value.trim();

  const appPassword =
    document.getElementById("appPassword").value.trim();

  const subject =
    document.getElementById("subject").value.trim();

  const message =
    document.getElementById("message").value.trim();

  const emails =
    document.getElementById("emails").value;

  const emailList = emails
    .split(/[\n,]+/)
    .map(e => e.trim())
    .filter(Boolean);

  if (
    !senderName ||
    !gmail ||
    !appPassword ||
    !subject ||
    !message ||
    !emailList.length
  ) {
    alert("Fill all fields");
    return;
  }

  if (
    hourlyStats.count + emailList.length >
    HOURLY_LIMIT
  ) {
    alert(
      "Hourly limit reached. Please wait."
    );
    return;
  }

  sendBtn.disabled = true;

  sendBtn.innerText = "Sending...";

  status.innerText = "Sending...";

  document.getElementById("total").innerText =
    emailList.length;

  document.getElementById("sent").innerText = "0";

  document.getElementById("failed").innerText = "0";

  let sent = 0;
  let failed = 0;

  try {

    for (let i = 0; i < emailList.length; i++) {

      const email = emailList[i];

      try {

        const response =
          await fetch("/send", {

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
              emails: email
            })

          });

        const data =
          await response.json();

        if (data.success) {

          sent++;

          hourlyStats.count++;

        } else {

          failed++;
        }

      } catch (err) {

        failed++;
      }

      document.getElementById("sent").innerText =
        sent;

      document.getElementById("failed").innerText =
        failed;

      await new Promise(resolve =>
        setTimeout(resolve, DELAY_MS)
      );
    }

    status.innerText = "Completed";

    sendBtn.disabled = false;

    sendBtn.innerText = "Send All";

    alert("Emails Sent Successfully");

  } catch (err) {

    status.innerText = "Server Error";

    sendBtn.disabled = false;

    sendBtn.innerText = "Send All";

    alert("Cannot connect to server");
  }
}

function logoutUser() {
  location.reload();
}
