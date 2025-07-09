import React, { useState } from "react";
import Input from "./input.jsx";
import Sidebar from "./sidebar.jsx";

function App() {
  const [loading, setLoading] = useState(false);
  const [title,   setTitle]   = useState("");
  const [summary, setSummary] = useState("");
  const [history, setHistory] = useState(null);

  const handleSubmit = async (url) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/summary', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link: url }),
      });
      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { title, videoSummary } = await res.json();
      setTitle(title);
      setSummary(videoSummary);
    } catch (err) {
      console.error("Error fetching summary:", err);
      setTitle("Error");
      setSummary("Could not get summary. Check console for details.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="appContainer" style={{ padding: "1rem" }}>
      <Input onSubmit={handleSubmit} loading={loading} />

      {loading && <p>Loading…</p>}

      {!loading && summary && (
        <div className="result">
          <h2>{title}</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}

export default App