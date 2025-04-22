import React, { useState } from "react";
import { Routes, Route, useNavigate, Link } from "react-router-dom";

import Masters from "./pages/Masters";
import USOpen from "./pages/USOpen";
import TheOpen from "./pages/TheOpen";
import PGA from "./pages/PGA";
import MyTeams from "./pages/MyTeams";
import LeagueHistory from "./pages/LeagueHistory";
import TeamEntryForm from "./TeamEntryForm";
import "./index.css";

function HomeWrapper() {
  return <Home />;
}

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
  const tournamentCutoffs = {
    Masters:   new Date("2025-04-10T10:00:00-04:00"),
    PGA:       new Date("2025-05-15T10:00:00-04:00"),
    "US Open": new Date("2025-06-12T10:00:00-04:00"),
    "The Open":new Date("2025-07-17T10:00:00-04:00"),
  };
  const tournamentList = Object.keys(tournamentCutoffs);

  const getStatuses = () => {
    const results = {};
    let currentSet = false;
    tournamentList.forEach((label) => {
      const cutoff    = tournamentCutoffs[label];
      const cutoff7   = new Date(cutoff.getTime() + 7 * 86400000);
      if (now > cutoff7) {
        results[label] = "closed";
      } else if (!currentSet) {
        results[label] = "current";
        currentSet = true;
      } else {
        results[label] = "upcoming";
      }
    });
    return results;
  };
  const tournamentStatuses = getStatuses();

  return (
    <div className="overlay" style={{ textAlign: "center" }}>
      {/* Header */}
      <h1>Steel Sons Golf Hub</h1>
      <h2>2025</h2>

      {/* Email form */}
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "360px",
          margin: "0 auto 2rem",
        }}
      >
        <label htmlFor="email" style={{ display: "block", marginBottom: "0.5rem" }}>
          My Teams
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ margin: "0 auto", width: "100%" }}
        />
        <button type="submit" className="submit-button" style={{ marginTop: "1rem" }}>
          Submit
        </button>
      </form>

      {/* Tournament Leaderboards */}
      <h2 className="section-title">Tournament Leaderboards</h2>
      <div
        className="grid-buttons"
        style={{
          margin: "0 auto 2rem",
          justifyItems: "center",
        }}
      >
        {tournamentList.map((label) => {
          const status = tournamentStatuses[label];
          return (
            <NavLink
              key={label}
              label={label}
              path={`/${label.toLowerCase().replace(" ", "-")}`}
              status={status}
            />
          );
        })}
      </div>

      {/* League History button */}
      <div style={{ margin: "1rem auto", maxWidth: "200px" }}>
        <Link to="/history" className="history-button">
          League History
        </Link>
      </div>
    </div>
  );
}

function NavLink({ label, path, status = "" }) {
  const statusText =
    status === "current"
      ? "Current"
      : status === "closed"
      ? "Closed"
      : status === "upcoming"
      ? "Upcoming"
      : "";

  return (
    <Link to={path} className={`link-button ${status}`}>
      <div style={{ textAlign: "center" }}>
        {label}
        {statusText && <div className="status-text">{statusText}</div>}
      </div>
    </Link>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeWrapper />} />
      <Route path="/masters"   element={<Masters />} />
      <Route path="/us-open"   element={<USOpen />} />
      <Route path="/the-open"  element={<TheOpen />} />
      <Route path="/pga"       element={<PGA />} />
      <Route path="/my-teams"  element={<MyTeams />} />
      <Route path="/history"   element={<LeagueHistory />} />
      <Route path="/enter/:tournament" element={<TeamEntryForm />} />
    </Routes>
  );
}
