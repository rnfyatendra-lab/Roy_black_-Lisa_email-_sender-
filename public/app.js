const LOGIN_ID = "##";
const LOGIN_PASSWORD = "##";

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {

  const id = document.getElementById("loginId").value.trim();

  const pass = document.getElementById("loginPassword").value.trim();

  if (id === LOGIN_ID && pass === LOGIN_PASSWORD) {

    document.getElementById("loginBox").style.display = "none";

    document.getElementById("mailer").style.display = "block";

  } else {

    alert("❌ Wrong Login");
  }

});

const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", async () => {

  sendBtn.disabled = true;

  sendBtn.innerHTML = "Sending...";

  const data = {

    senderName:
      document.getElementById("senderName").value,

    gmail:
      document.getElementById("gmail").value,

    appPassword:
      document.getElementById("appPassword").value,

    subject:
      document.getElementById("subject").value,

    message:
      document.getElementById("message").value,

    recipients:
      document.getElementById("recipients").value

  };

  // 1 SECOND TIMEOUT
  const controller = new AbortController();

  const timeout = setTimeout(() => {

    controller.abort();

  }, 1000);

  try {

    const response = await fetch("/send", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(data),

      signal: controller.signal

    });

    clearTimeout(timeout);

    const result = await response.json();

    alert(result.popup);

    document.getElementById("result").innerHTML =
      result.popup;

  } catch (err) {

    console.log(err);

    if (err.name === "AbortError") {

      alert("❌ Server Timeout");

    } else {

      alert("❌ Network Error");
    }

  }

  sendBtn.disabled = false;

  sendBtn.innerHTML = "Send All";

});

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("dblclick", () => {

  location.reload();

});
