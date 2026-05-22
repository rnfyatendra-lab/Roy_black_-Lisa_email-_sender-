const LOGIN_ID = "1#Googles";
const LOGIN_PASSWORD = "1#Googles";

function loginUser(){

  const id =
    document.getElementById("loginId").value.trim();

  const password =
    document.getElementById("loginPassword").value.trim();

  if(
    id === LOGIN_ID &&
    password === LOGIN_PASSWORD
  ){

    document.getElementById("loginPage")
      .style.display = "none";

    document.getElementById("mainApp")
      .style.display = "block";

  }else{

    alert("Wrong Login Details");
  }
}



async function sendEmails() {

  const sendBtn =
    document.querySelector(".send-btn");

  const statusBox =
    document.getElementById("status");

  if(sendBtn.disabled){
    return;
  }

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

  document.getElementById("total").innerText =
    emailList.length;

  document.getElementById("sent").innerText =
    "0";

  document.getElementById("failed").innerText =
    "0";

  statusBox.innerText = "Sending...";

  sendBtn.disabled = true;

  sendBtn.innerText = "Sending...";

  try{

    const response =
      await fetch("/send",{

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
          emails
        })
      });

    const data = await response.json();

    if(data.success){

      document.getElementById("sent").innerText =
        data.sent || 0;

      document.getElementById("failed").innerText =
        data.failed || 0;

      statusBox.innerText = "Completed";

      statusBox.style.color = "green";

      alert("Emails Sent Successfully");

    }else{

      statusBox.innerText = "Error";

      statusBox.style.color = "red";

      alert(data.message || "Server Error");
    }

  }catch(err){

    console.log(err);

    statusBox.innerText = "Server Error";

    statusBox.style.color = "red";

    alert("Cannot connect to server");

  }finally{

    sendBtn.disabled = false;

    sendBtn.innerText = "Send All";
  }
}



function logoutUser(){

  location.reload();
}
