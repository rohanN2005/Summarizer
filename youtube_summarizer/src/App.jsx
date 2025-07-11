import React, { useState } from "react";
import Input from "./input.jsx";
import Sidebar from "./sidebar.jsx";
import { Logout } from "./logout.jsx";
import { useEffect } from "react";

function App() {
  const [loading, setLoading] = useState(false);
  const [title,   setTitle]   = useState("");
  const [summary, setSummary] = useState("");
  const [history, setHistory] = useState([]);

  const getHistory =  async() =>{
    const res = await fetch('/api/summary/history', {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
    if (res.status === 401) {
      window.location.href = '/login';
      return;
    }
    if (!res.ok) {
      console.error("Failed to load history:", await res.text());
      return;
    }
    const {history} = await res.json();
    setHistory(history);
  }

  const handleSubmit = async (url) => {
    setLoading(true);
    try {
      const res = await fetch('/api/summary', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link: url }),
      });
      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const { title, videoSummary, history } = await res.json();
      setTitle(title);
      setSummary(videoSummary);
      setHistory(history);
    } catch (err) {
      console.error("Error fetching summary:", err);
      setTitle("Error");
      setSummary("Could not get summary. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const onSelect = (item) => {
    setSummary(item.summary)
    setTitle(item.title)
  }

  const handleDelete = async (id) => {
      const res = await fetch(`/api/summary/${id}`, {
        method: "DELETE", 
        headers: {"Content-Type":"application/json"}
      }
    );
    if(res.ok){
      console.error("Delete Failed", await res.text());
      return ;
    }
    const {history: newHistory} = await res.json();
    setHistory(newHistory);
  }

  useEffect(() => {
    getHistory();
  }, []);
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
      <Sidebar onSelect={onSelect} history={history} handleDelete={handleDelete}/>
      <Logout/>
    </div>
  );
}

export default App