const HOURLY_LIMIT = 28;
const PARALLEL = 2;
const DELAY_MS = 200;

let stats = {};

setInterval(() => {
  stats = {};
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

  document.getElementById("total").innerText =
    emailList.length;

  document.getElementById("sent").innerText = "0";

  document.getElementById("failed").innerText = "0";

  status.innerText = "Sending...";

  sendBtn.disabled = true;

  sendBtn.innerText = "Sending...";

  let sent = 0;
  let failed = 0;

  try {

    for (let i = 0; i < emailList.length; i += PARALLEL) {

      const batch =
        emailList.slice(i, i + PARALLEL);

      await Promise.all(

        batch.map(async (email) => {

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

            const data = await response.json();

            if (data.success) {
              sent++;
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

        })

      );

      await new Promise(resolve =>
        setTimeout(resolve, DELAY_MS)
      );
    }

    status.innerText = "Completed";

    sendBtn.disabled = false;

    sendBtn.innerText = "Send All";

    alert("All Emails Sent");

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
