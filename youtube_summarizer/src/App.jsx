// src/App.jsx
import React, { useState, useEffect } from "react";
import InputBar from "./input.jsx";
import Sidebar from "./sidebar.jsx";
import Logout from "./logout.jsx";
import { Box, CircularProgress } from '@mui/material';

function App() {
  const [loading, setLoading] = useState(false);
  const [title,   setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [history, setHistory] = useState([]);

  const getHistory = async () => {
    const res = await fetch("/api/summary/history", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (res.status === 401) {
      window.location.href = "/login";
      return;
    }
    if (!res.ok) {
      console.error("Failed to load history:", await res.text());
      return;
    }
    const { history } = await res.json();
    setHistory(history);
  };

  const handleSubmit = async (url) => {
    setLoading(true);
    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link: url }),
      });
      if (res.status === 401) {
        window.location.href = "/login";
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
    setTitle(item.Title);
    setSummary(item.summary);
  };

  const newSummarySelect= () => {
    setTitle("");
    setSummary("");
  }

  const handleDelete = async (id) => {
    const res = await fetch(`/api/summary/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      console.error("Delete Failed", await res.text());
      return;
    }
    const { history: newHistory } = await res.json();
    setHistory(newHistory);
  };

  useEffect(() => {
    getHistory();
  }, []);

  return (
    <div className="appContainer" style={{ display: "flex" }}>
      {/* MATERIAL‑UI SIDEBAR */}
      <Sidebar
        history={history}
        onSelect={onSelect}
        onDelete={handleDelete}
        newSummarySelect={newSummarySelect}
      />

      {/* MAIN CONTENT */}
      <div className="main" style={{ flexGrow: 1, padding: "1rem" }}>
        <div className="content">
        {loading && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '60vh',
              }}
            >
              <CircularProgress />
            </Box>
          )}
          {!loading && summary && (
            <div className="result">
              <h2 className="title">{title}</h2>
              <p className="body">{summary}</p>
            </div>
          )}
        </div>

        {/* MATERIAL‑UI INPUT BAR (fixed to bottom) */}
        <InputBar onSubmit={handleSubmit} loading={loading} />

        {/* LOGOUT BUTTON */}
        <Logout />
      </div>
    </div>
  );
}

export default App;
