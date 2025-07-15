import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const TOURNAMENTS = ["Masters", "PGA", "US Open", "The Open"];

export default function MyTeams() {
  const location = useLocation();
  const emailFromRoute = location.state?.email || "";

  const [currentEmail, setCurrentEmail] = useState(emailFromRoute);
  const [newEmail, setNewEmail] = useState(emailFromRoute);

  const [mastersTeams, setMastersTeams] = useState({ 1: [], 2: [] });
  const [pgaTeams, setPgaTeams] = useState({ 1: [], 2: [] });
  const [usOpenTeams, setUsOpenTeams] = useState({ 1: [], 2: [] });
  const [theOpenTeams, setTheOpenTeams] = useState({ 1: [], 2: [] });

  const now = new Date();
  const cutoffTimes = {
    Masters: new Date("2025-04-10T10:00:00-04:00"),
    PGA: new Date("2025-05-15T10:00:00-04:00"),
    "US Open": new Date("2025-06-12T09:00:00-04:00"),
    "The Open": new Date("2025-07-17T05:00:00-04:00"),
  };

  useEffect(() => {
    async function fetchTeams(url, setter) {
      try {
        const resp = await fetch(url);
        const data = await resp.json();
        const teams = { 1: [], 2: [] };
        data.forEach((entry) => {
          const teamNum = entry.Team.includes("(2)") ? 2 : 1;
          teams[teamNum].push(entry.Golfer);
        });
        setter({
          1: teams[1].length === 5 ? teams[1] : [],
          2: teams[2].length === 5 ? teams[2] : [],
        });
      } catch (err) {
        console.error("Error fetching teams:", err);
        setter({ 1: [], 2: [] });
      }
    }

    if (currentEmail) {
      fetchTeams(
        `https://script.google.com/macros/s/AKfycbzwgBuOrnxHL8qgDPM7JtwjKrdPiF3cOvxkGln3hBp5E-ApEbEfsE5v125ioFFeW46Mrg/exec?email=${encodeURIComponent(currentEmail)}`,
        setMastersTeams
      );
      fetchTeams(
        `https://script.google.com/macros/s/AKfycbxER3yi16qh1MPN3W7Ta-L3TrE6mG9CqytsCVAatHvMbbuv-VAW3-3alTMDGF7ySdCufQ/exec?email=${encodeURIComponent(currentEmail)}`,
        setPgaTeams
      );
      fetchTeams(
        `https://script.google.com/macros/s/AKfycbwo0R6zFKsOfyxgns-v5ubBUfqjRXjllvH1FpLDcK3As4Byb2O_hG7k3QbQxvY2iOw5RA/exec?email=${encodeURIComponent(currentEmail)}`,
        setUsOpenTeams
      );
      fetchTeams(
        `https://script.google.com/macros/s/AKfycbzYjy4SprXytEFAYM8WDXlXOYMH7I9d0Obl2aCxxhnq7hBW8frg61I_cn72SE-TWjaKMg/exec?email=${encodeURIComponent(currentEmail)}&mode=json`,
        setTheOpenTeams
      );
    }
  }, [currentEmail]);

  const handleEmailChange = (e) => {
    e.preventDefault();
    const trimmed = newEmail.trim();
    if (trimmed && trimmed !== currentEmail) {
      setCurrentEmail(trimmed);
    }
  };

  // Determine the next tournament
  function getNextTournamentKey() {
    for (let t of TOURNAMENTS) {
      if (now < cutoffTimes[t]) return t;
    }
    return null;
  }

  const nextTournament = getNextTournamentKey();

  const allTeamData = {
    Masters: mastersTeams,
    PGA: pgaTeams,
    "US Open": usOpenTeams,
    "The Open": theOpenTeams,
  };

  return (
<div style={{ padding: "2rem", position: "relative", zIndex: 1 }}>
<form onSubmit={handleEmailChange} className="email-form">
        <input
          type="email"
          placeholder="Enter your email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="email-input"
        />
        <button type="submit" className="submit-button">Submit</button>
      </form>

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "0.3rem" }}>My Teams</h2>
        {currentEmail && (
          <div style={{ fontWeight: 600, color: "#FFD700" }}>{currentEmail}</div>
        )}
      </div>

      {currentEmail ? (
        <div className="teams-grid">
          {TOURNAMENTS.map((t, idx) => {
            const teams = allTeamData[t];
            const cutoff = cutoffTimes[t];
            const isCurrent = now < cutoff && t === nextTournament;
            const isClosed = now >= cutoff;
            let formLink = "#";
            if (t === "Masters") {
              formLink = `https://script.google.com/macros/s/AKfycbyM_KcivAteMOC_SAKZZkMBDEfqj9ep7gfFOzIxTn2LtDSTfs-O_O1McU9D8jmbADOfhw/exec?email=${encodeURIComponent(currentEmail)}`;
            } else if (t === "PGA") {
              formLink = `https://script.google.com/macros/s/AKfycbz44QE8_JF30JJ5DlGn1LbNj61-G8TIfHre8ysmj2RV0yRsymMBKcP5A8hbgvaMWChgRw/exec?email=${encodeURIComponent(currentEmail)}`;
            } else if (t === "US Open") {
              formLink = `https://script.google.com/macros/s/AKfycbw4lNEjB79XT1yc1NtSJ8_hd9v9xG0oyqvEDfZGR6hYoIikQhp8ndx4KHv5cEZBPs1LCQ/exec?email=${encodeURIComponent(currentEmail)}`;
            } else if (t === "The Open") {
              formLink = `https://script.google.com/macros/s/AKfycbzYjy4SprXytEFAYM8WDXlXOYMH7I9d0Obl2aCxxhnq7hBW8frg61I_cn72SE-TWjaKMg/exec?email=${encodeURIComponent(currentEmail)}`;
            }

            return (
              <div
                key={idx}
                className={`team-card ${isCurrent ? "glow-border" : ""}`}
              >
                <h3 style={{ color: "#FFD700", marginBottom: "0.25rem" }}>{t}</h3>
                <p style={{ fontSize: "0.9rem", color: "#aaa", marginBottom: "0.5rem" }}>
                  {isCurrent ? "Current" : isClosed ? "Closed" : "Upcoming"}
                </p>

                {isCurrent ? (
                  <a
                    href={formLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{ fontSize: "0.9rem", color: "#00ff99", fontWeight: "bold" }}
                  >
                    Enter/Edit
                  </a>
                ) : (
                  <span style={{ fontSize: "0.9rem", color: "#888" }}>
                    {isClosed ? "Entries Closed" : "Entry Not Open Yet"}
                  </span>
                )}

                <div className="team-row" style={{ marginTop: "1rem" }}>
                  <TeamList teamName="Team 1" players={teams[1]} />
                  <TeamList teamName="Team 2" players={teams[2]} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ textAlign: "center", marginTop: "3rem", color: "#bbb", fontStyle: "italic" }}>
          Please enter email above
        </p>
      )}
    </div>
  );
}

function TeamList({ teamName, players }) {
  return (
    <div style={{ flex: 1 }}>
      <p style={{ fontWeight: "bold", color: "#4CAF50" }}>{teamName}</p>
      {players.length === 5 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {players.map((p, i) => (
            <li key={i} style={{ color: "#ccc", marginBottom: "0.3rem" }}>{p}</li>
          ))}
        </ul>
      ) : (
        <p style={{ color: "#888", fontStyle: "italic" }}>No Entry</p>
      )}
    </div>
  );
}
