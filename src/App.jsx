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
  const [loading, setLoading] = useState(false);

  const sendEmails = async () => {
    const emailList = emails
      .split("\n")
      .map((e) => e.trim())
      .filter((e) => e !== "");

    setTotal(emailList.length);

    let sentCount = 0;
    let failedCount = 0;

    setLoading(true);

    for (let i = 0; i < emailList.length; i++) {
      try {
        const response = await fetch("http://localhost:5000/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            gmail,
            password,
            senderName,
            to: emailList[i],
            subject,
            message,
          }),
        });

        const data = await response.json();

        if (data.success) {
          sentCount++;
          setSent(sentCount);
        } else {
          failedCount++;
          setFailed(failedCount);
        }
      } catch (error) {
        failedCount++;
        setFailed(failedCount);
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
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
  };

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6">

        <h1 className="text-3xl font-bold text-center mb-6">
          Bulk Mail Sender
        </h1>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Your Gmail"
            value={gmail}
            onChange={(e) => setGmail(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="password"
            placeholder="App Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            placeholder="Sender Name"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />

          <textarea
            rows={5}
            placeholder="Recipient Emails"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />

          <textarea
            rows={6}
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />

          <div className="grid grid-cols-2 gap-4">

            <button
              onClick={sendEmails}
              disabled={loading}
              className="bg-green-500 text-white py-3 rounded-xl"
            >
              {loading ? "Sending..." : "Send"}
            </button>

            <button
              onClick={clearAll}
              className="bg-red-500 text-white py-3 rounded-xl"
            >
              Clear
            </button>

          </div>

          <button className="w-full bg-slate-700 text-white py-3 rounded-xl">
            Exit
          </button>

        </div>

        <div className="mt-8 bg-slate-100 rounded-2xl p-5">

          <h2 className="text-2xl font-bold text-center mb-5">
            Sending Progress
          </h2>

          <div className="grid grid-cols-3 gap-4">

            <div className="bg-white p-4 rounded-xl text-center shadow">
              <p>Total</p>
              <h3 className="text-2xl font-bold">{total}</h3>
            </div>

            <div className="bg-white p-4 rounded-xl text-center shadow">
              <p>Sent</p>
              <h3 className="text-2xl font-bold text-green-600">{sent}</h3>
            </div>

            <div className="bg-white p-4 rounded-xl text-center shadow">
              <p>Failed</p>
              <h3 className="text-2xl font-bold text-red-600">{failed}</h3>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
