// FILE NAME: src/App.jsx

import { useState } from "react";

export default function App() {
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [senderName, setSenderName] = useState("");
  const [emails, setEmails] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [total, setTotal] = useState(0);
  const [sent, setSent] = useState(0);
  const [failed, setFailed] = useState(0);
  const [status, setStatus] = useState("Ready");
  const [loading, setLoading] = useState(false);

  const sendEmails = async () => {
    const emailList = emails
      .split(/[\n,]+/)
      .map((e) => e.trim())
      .filter((e) => e !== "");

    if (
      !gmail ||
      !password ||
      !senderName ||
      !subject ||
      !message ||
      emailList.length === 0
    ) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    setTotal(emailList.length);
    setSent(0);
    setFailed(0);

    try {
      setStatus("Sending...");

      const response = await fetch(
        "https://YOUR-BACKEND.onrender.com/send-email",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            gmail,
            password,
            senderName,
            emails: emailList,
            subject,
            message,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSent(data.sent);
        setFailed(data.failed);
        setStatus("Completed");
      } else {
        setStatus(data.message || "Failed");
      }
    } catch (error) {
      setStatus("Server Error");
    }

    setLoading(false);
  };

  const clearAll = () => {
    setGmail("");
    setPassword("");
    setSenderName("");
    setEmails("");
    setSubject("");
    setMessage("");
    setTotal(0);
    setSent(0);
    setFailed(0);
    setStatus("Ready");
  };

  const logout = () => {
    clearAll();

    localStorage.clear();

    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#eef2f7] flex items-center justify-center p-5">

      <div className="w-full max-w-6xl bg-white rounded-[30px] shadow-lg p-10">

        <h1 className="text-center text-4xl font-bold mb-10">
          Fast Mail Launcher
        </h1>

        <div className="grid md:grid-cols-2 gap-6">

          <input
            type="text"
            placeholder="Sender Name"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            className="border border-gray-300 rounded-2xl p-5 text-2xl outline-none"
          />

          <input
            type="email"
            placeholder="Your Gmail"
            value={gmail}
            onChange={(e) => setGmail(e.target.value)}
            className="border border-gray-300 rounded-2xl p-5 text-2xl outline-none"
          />

          <input
            type="password"
            placeholder="App Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-2xl p-5 text-2xl outline-none"
          />

          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border border-gray-300 rounded-2xl p-5 text-2xl outline-none"
          />

          <textarea
            rows={8}
            placeholder="Message Body"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border border-gray-300 rounded-2xl p-5 text-2xl resize-none outline-none"
          />

          <textarea
            rows={8}
            placeholder="Recipients (comma or newline)"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            className="border border-gray-300 rounded-2xl p-5 text-2xl resize-none outline-none"
          />
        </div>

        <div className="grid md:grid-cols-[1fr_180px] gap-6 mt-8">

          <button
            onClick={sendEmails}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 transition-all text-white text-3xl font-bold rounded-2xl py-6"
          >
            {loading ? "Sending..." : "Send All"}
          </button>

          <button
            onDoubleClick={logout}
            className="bg-blue-500 hover:bg-blue-600 transition-all text-white text-2xl font-bold rounded-2xl py-6"
          >
            Logout
          </button>
        </div>

        <p className="text-center text-gray-500 mt-2">
          Double-click logout button
        </p>

        <div className="mt-10 grid md:grid-cols-4 gap-5">

          <div className="bg-gray-100 rounded-2xl p-5 text-center">
            <p className="text-gray-500 text-lg">Total</p>
            <h2 className="text-4xl font-bold">{total}</h2>
          </div>

          <div className="bg-gray-100 rounded-2xl p-5 text-center">
            <p className="text-gray-500 text-lg">Sent</p>
            <h2 className="text-4xl font-bold text-green-600">
              {sent}
            </h2>
          </div>

          <div className="bg-gray-100 rounded-2xl p-5 text-center">
            <p className="text-gray-500 text-lg">Failed</p>
            <h2 className="text-4xl font-bold text-red-600">
              {failed}
            </h2>
          </div>

          <div className="bg-gray-100 rounded-2xl p-5 text-center">
            <p className="text-gray-500 text-lg">Status</p>
            <h2 className="text-xl font-bold">{status}</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
