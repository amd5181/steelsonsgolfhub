import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Masters from "./pages/Masters";
import USOpen from "./pages/USOpen";
import TheOpen from "./pages/TheOpen";
import PGA from "./pages/PGA";
import MyTeams from "./pages/MyTeams";
import LeagueHistory from "./pages/LeagueHistory";
import TeamEntryForm from "./TeamEntryForm";
import "./index.css";

function Home() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      navigate("/my-teams", { state: { email } });
    }
  };

  const now = new Date();

  // Tournament cutoff dates
  const tournamentCutoffs = {
    Masters: new Date("2025-04-10T10:00:00-04:00"),
    PGA: new Date("2025-05-15T10:00:00-04:00"),
    "US Open": new Date("2025-06-12T10:00:00-04:00"),
    "The Open": new Date("2025-07-17T10:00:00-04:00"),
  };

  const tournamentList = ["Masters", "PGA", "US Open", "The Open"];

  const getStatuses = () => {
    const results = {};
    const extendedCutoffs = tournamentList.map(label => {
      const cutoff = tournamentCutoffs[label];
      return {
        label,
        cutoff,
        cutoffPlus7: new Date(cutoff.getTime() + 7 * 24 * 60 * 60 * 1000),
      };
    });

    let currentSet = false;
    for (let i = 0; i < extendedCutoffs.length; i++) {
      const { label, cutoffPlus7 } = extendedCutoffs[i];
      if (now > cutoffPlus7) {
        results[label] = "closed";
      } else if (!currentSet) {
        results[label] = "current";
        currentSet = true;
      } else {
        results[label] = "upcoming";
      }
    }

    return results;
  };

  const tournamentStatuses = getStatuses();

  return (
    <div className="overlay">
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.2rem", color: "#FFD700" }}>
        Steel Sons Golf Hub
      </h1>
      <h2 style={{ fontWeight: 400, marginTop: "-0.5rem", marginBottom: "2rem", color: "white" }}>2025</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem", textAlign: "center" }}>
        <label htmlFor="email" style={{ fontSize: "1.25rem", fontWeight: "700", color: "#eee" }}>My Teams</label>
        <input
          id="email"
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <button type="submit" className="submit-button">Submit</button>
      </form>

      {/* New Section Title */}
      <h2 className="section-title">Tournament Leaderboards</h2>

      <div className="grid-buttons">
        {tournamentList.map((label) => (
          <NavLink
            key={label}
            label={label}
            path={`/${label.toLowerCase().replace(" ", "-")}`}
            status={tournamentStatuses[label]}
          />
        ))}
      </div>

      <NavLink label="League History" path="/history" className="history-button" />
    </div>
  );
}

function NavLink({ label, path, status = "", className = "link-button" }) {
  const statusText =
    status === "current" ? "Current" :
    status === "closed" ? "Closed" :
    status === "upcoming" ? "Upcoming" : "";

  return (
    <a href={path} className={`${className} ${status}`}>
      <div style={{ textAlign: "center" }}>
        {label}
        {statusText && <div className="status-text">{statusText}</div>}
      </div>
    </a>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/masters" element={<Masters />} />
      <Route path="/us-open" element={<USOpen />} />
      <Route path="/the-open" element={<TheOpen />} />
      <Route path="/pga" element={<PGA />} />
      <Route path="/my-teams" element={<MyTeams />} />
      <Route path="/history" element={<LeagueHistory />} />
      <Route path="/enter/:tournament" element={<TeamEntryForm />} />
    </Routes>
  );
}
