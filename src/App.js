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

// ✅ Home inside router context
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
    Masters: new Date("2025-04-10T10:00:00-04:00"),
    PGA: new Date("2025-05-15T10:00:00-04:00"),
    "US Open": new Date("2025-06-12T10:00:00-04:00"),
    "The Open": new Date("2025-07-17T10:00:00-04:00"),
  };

  const tournamentList = ["Masters", "PGA", "US Open", "The Open"];

  const getStatuses = () => {
    const results = {};
    const extendedCutoffs = tournamentList.map((label) => {
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
      <h1>Steel Sons Golf Hub</h1>
      <h2>2025</h2>

      <form
        onSubmit={handleSubmit}
        style={{ textAlign: "center", width: "100%", marginBottom: "2rem" }}
      >
        <label htmlFor="email">My Teams</label>
        <input
          id="email"
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <button
          type="submit"
          className="submit-button"
          style={{ marginTop: "1rem" }}
        >
          Submit
        </button>
      </form>

      <h2 className="section-title">Tournament Leaderboards</h2>

      <div className="grid-buttons">
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
    </div>
  );
}

function NavLink({ label, path, status = "", className = "link-button" }) {
  const statusText =
    status === "current"
      ? "Current"
      : status === "closed"
      ? "Closed"
      : status === "upcoming"
      ? "Upcoming"
      : "";

  return (
    <Link to={path} className={`${className} ${status}`}>
      <div style={{ textAlign: "center" }}>
        {label}
        {statusText && <div className="status-text">{statusText}</div>}
      </div>
    </Link>
  );
}

// ✅ NO <Router> here — it's already in index.js
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeWrapper />} />
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
