async function sendEmails() {

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
    document.getElementById("emails").value.trim();

  const totalBox =
    document.getElementById("total");

  const sentBox =
    document.getElementById("sent");

  const failedBox =
    document.getElementById("failed");

  const statusBox =
    document.getElementById("status");

  if(
    !senderName ||
    !gmail ||
    !appPassword ||
    !subject ||
    !message ||
    !emails
  ){
    alert("Please fill all fields");
    return;
  }

  const emailList = emails
    .split(/[\n,]+/)
    .map(e => e.trim())
    .filter(Boolean);

  totalBox.innerText = emailList.length;

  sentBox.innerText = "0";
  failedBox.innerText = "0";

  statusBox.innerText = "Sending...";

  try{

    const response = await fetch("/send",{

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({

        senderName,
        gmail,
        appPassword,
        subject,
        message,

        recipients:emailList.join(",")
      })
    });

    const data = await response.json();

    if(data.success){

      sentBox.innerText = data.sent;
      failedBox.innerText = data.failed;

      statusBox.innerText = "Completed";

      statusBox.style.color = "green";

      alert("Emails Sent Successfully");

    }else{

      statusBox.innerText = "Failed";

      statusBox.style.color = "red";

      alert(data.message || "Server Error");
    }

  }catch(error){

    console.log(error);

    statusBox.innerText = "Server Error";

    statusBox.style.color = "red";

    alert("Cannot connect to server");
  }
}

function logout(){

  document.getElementById("senderName").value = "";

  document.getElementById("gmail").value = "";

  document.getElementById("appPassword").value = "";

  document.getElementById("subject").value = "";

  document.getElementById("message").value = "";

  document.getElementById("emails").value = "";

  document.getElementById("total").innerText = "0";

  document.getElementById("sent").innerText = "0";

  document.getElementById("failed").innerText = "0";

  const statusBox =
    document.getElementById("status");

  statusBox.innerText = "Idle";

  statusBox.style.color = "black";
}
