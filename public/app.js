const sendBtn = document.getElementById("sendBtn");

sendBtn.addEventListener("click", async () => {

  document.getElementById("result").innerHTML = "Sending...";

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

    }else{

      document.getElementById("result").innerHTML =
        `❌ ${result.message}`;
    }

  } catch(err){

    document.getElementById("result").innerHTML =
      err.message;
  }

});
