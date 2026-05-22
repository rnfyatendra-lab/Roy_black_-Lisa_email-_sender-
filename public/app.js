const sendBtn = document.getElementById("sendBtn");
const logoutBtn = document.getElementById("logoutBtn");

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

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify(data)

    });

    const result = await response.json();

    if(result.success){

      document.getElementById("result").innerHTML =
        `✅ Sent: ${result.sent} | ❌ Failed: ${result.failed}`;

      document.getElementById("subject").value = "";
      document.getElementById("message").value = "";
      document.getElementById("recipients").value = "";

    }else{

      document.getElementById("result").innerHTML =
        `❌ ${result.message}`;
    }

  } catch(err){

    document.getElementById("result").innerHTML =
      err.message;
  }

  sendBtn.disabled = false;

  sendBtn.innerHTML = "Send All";

});

logoutBtn.addEventListener("dblclick", () => {

  document.getElementById("gmail").value = "";
  document.getElementById("appPassword").value = "";

  alert("Logged Out");

});
