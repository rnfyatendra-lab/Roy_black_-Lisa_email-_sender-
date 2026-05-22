const LOGIN_ID = "##";
const LOGIN_PASSWORD = "##";

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {

  const id = document.getElementById("loginId").value;
  const pass = document.getElementById("loginPassword").value;

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

  document.getElementById("result").innerHTML = "";

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

  try {

    const response = await fetch("/send", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(data)
    });

    const result = await response.json();

    alert(result.popup);

    if (result.success) {

      document.getElementById("result").innerHTML =
        `✅ Mail Sent ${result.sent}`;

      document.getElementById("subject").value = "";
      document.getElementById("message").value = "";
      document.getElementById("recipients").value = "";

    }

  } catch (err) {

    alert("❌ Network Error");
  }

  sendBtn.disabled = false;

  sendBtn.innerHTML = "Send All";

});

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("dblclick", () => {

  location.reload();

});
