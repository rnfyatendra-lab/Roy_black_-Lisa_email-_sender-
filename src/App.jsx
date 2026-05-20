import { useState } from "react";

export default function App() {
  const [senderName, setSenderName] = useState("");
  const [gmail, setGmail] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [recipients, setRecipients] = useState("");

  const [total, setTotal] = useState(0);
  const [sent, setSent] = useState(0);
  const [failed, setFailed] = useState(0);
  const [status, setStatus] = useState("Idle");

  const sendEmails = async () => {
    try {
      setStatus("Sending...");

      const emailList = recipients
        .split(/[\n,]+/)
        .map((e) => e.trim())
        .filter((e) => e);

      setTotal(emailList.length);

      const response = await fetch(
        "https://roy-black-lisa-email-sender.onrender.com/send-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            senderName,
            gmail,
            appPassword,
            subject,
            message,
            recipients: emailList,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSent(data.sent);
        setFailed(data.failed);
        setStatus("Completed");
      } else {
        setStatus("Server Error");
      }
    } catch (err) {
      console.log(err);
      setStatus("Server Error");
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#eef2f7",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          background: "#fff",
          borderRadius: "20px",
          padding: "40px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          <input
            placeholder="Sender Name"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            className="input"
          />

          <input
            placeholder="Your Gmail"
            value={gmail}
            onChange={(e) => setGmail(e.target.value)}
            className="input"
          />

          <input
            placeholder="App Password"
            type="password"
            value={appPassword}
            onChange={(e) => setAppPassword(e.target.value)}
            className="input"
          />

          <input
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="input"
          />

          <textarea
            placeholder="Message Body"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="textarea"
          />

          <textarea
            placeholder="Recipients"
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            className="textarea"
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <button
            onClick={sendEmails}
            style={{
              flex: 1,
              background: "#3478f6",
              color: "#fff",
              border: "none",
              height: "70px",
              borderRadius: "14px",
              fontSize: "32px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Send All
          </button>

          <button
            onDoubleClick={logout}
            style={{
              width: "180px",
              background: "#3478f6",
              color: "#fff",
              border: "none",
              borderRadius: "14px",
              fontSize: "28px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: "10px",
            color: "#777",
          }}
        >
          Double-click logout button
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          <Box title="Total" value={total} />
          <Box title="Sent" value={sent} green />
          <Box title="Failed" value={failed} red />
          <Box title="Status" value={status} />
        </div>
      </div>

      <style>{`
        .input{
          height:70px;
          border-radius:14px;
          border:2px solid #ddd;
          padding:0 20px;
          font-size:30px;
          outline:none;
        }

        .textarea{
          height:220px;
          border-radius:14px;
          border:2px solid #ddd;
          padding:20px;
          font-size:28px;
          outline:none;
          resize:none;
        }
      `}</style>
    </div>
  );
}

function Box({ title, value, green, red }) {
  return (
    <div
      style={{
        background: "#f5f5f5",
        borderRadius: "14px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: "#777",
          fontSize: "24px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: "10px",
          fontSize: "42px",
          fontWeight: "bold",
          color: green ? "green" : red ? "red" : "#000",
        }}
      >
        {value}
      </div>
    </div>
  );
}
