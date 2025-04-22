import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

const TOURNAMENTS = ["Masters", "PGA", "US Open", "The Open"];

export default function MyTeams() {
  const location = useLocation();
  // start with the email from homepage
  const initialEmail = location.state?.email || "";
  const [currentEmail, setCurrentEmail] = useState(initialEmail);
  const [newEmail, setNewEmail] = useState(initialEmail);

  const [mastersTeams, setMastersTeams] = useState({ 1: [], 2: [] });
  const [pgaTeams, setPgaTeams] = useState({ 1: [], 2: [] });
  const [usOpenTeams, setUsOpenTeams] = useState({ 1: [], 2: [] });
  const [theOpenTeams, setTheOpenTeams] = useState({ 1: [], 2: [] });

  const now = new Date();
  const cutoffTimes = {
    Masters:   new Date("2025-04-10T10:00:00-04:00"),
    PGA:       new Date("2025-05-15T10:00:00-04:00"),
    "US Open": new Date("2025-06-12T10:00:00-04:00"),
    "The Open":new Date("2025-07-17T10:00:00-04:00"),
  };

  // Re-fetch whenever currentEmail changes
  useEffect(() => {
    async function fetchTeams(url, setter) {
      try {
        const resp = await fetch(`${url}?email=${encodeURIComponent(currentEmail)}`);
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
        console.error("Error fetching teams for", url, err);
        setter({ 1: [], 2: [] });
      }
    }

    // your exact original URLs
    fetchTeams(
      `https://script.google.com/macros/s/AKfycbzwgBuOrnxHL8qgDPM7JtwjKrdPiF3cOvxkGln3hBp5E-ApEbEfsE5v125ioFFeW46Mrg/exec?email=${encodeURIComponent(email)}`,
      setMastersTeams
    );

    fetchTeams(
      `https://script.google.com/macros/s/AKfycbxER3yi16qh1MPN3W7Ta-L3TrE6mG9CqytsCVAatHvMbbuv-VAW3-3alTMDGF7ySdCufQ/exec?email=${encodeURIComponent(email)}`,
      setPgaTeams
    );

    fetchTeams(
      `https://script.google.com/macros/s/AKfycbwo0R6zFKsOfyxgns-v5ubBUfqjRXjllvH1FpLDcK3As4Byb2O_hG7k3QbQxvY2iOw5RA/exec?email=${encodeURIComponent(email)}`,
      setUsOpenTeams
    );

    fetchTeams(
      `https://script.google.com/macros/s/AKfycbxvrk7mewm9tXV4Z7lHj1E_SieONu4EhEebbytmpQ1yeVvWXBTz181wXrLftgHMhm5yAQ/exec?email=${encodeURIComponent(email)}&mode=json`,
      setTheOpenTeams
    );
  }, [currentEmail]);

  const getTournamentStatuses = () => {
    const statuses = {};
    let currentSet = false;
    TOURNAMENTS.forEach((t) => {
      const cutoff = cutoffTimes[t];
      const cutoffPlus7 = new Date(cutoff.getTime() + 7 * 24 * 60 * 60 * 1000);
      if (now > cutoffPlus7) {
        statuses[t] = "closed";
      } else if (!currentSet && now < cutoffPlus7) {
        statuses[t] = "current";
        currentSet = true;
      } else {
        statuses[t] = "upcoming";
      }
    });
    return statuses;
  };
  const tournamentStatuses = getTournamentStatuses();

  // handle change-email form submit
  const handleEmailChange = (e) => {
    e.preventDefault();
    setCurrentEmail(newEmail.trim());
  };

  return (
    <div className="overlay" style={{ paddingTop: "2rem" }}>
      {/* Nav header */}
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={styles.title}>Steel Sons Golf Hub</h1>
        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
          <Link to="/" style={styles.navLink}>Home</Link>
          <Link to="/history" style={styles.navLink}>History</Link>
          <Link to="/leaderboards" style={styles.navLink}>Leaderboards</Link>
        </div>
      </div>

      {/* Change Email form */}
      <form onSubmit={handleEmailChange} style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="Enter new email"
        />
        <button type="submit" className="submit-button">Change Email</button>
      </form>

      <h2 style={styles.emailHeader}>
        My Teams — <span style={{ fontWeight: 700 }}>{currentEmail}</span>
      </h2>

      {/* Leaderboards links */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
        {TOURNAMENTS.map((t) => (
          <Link key={t} to={`/leaderboards/${t.toLowerCase().replace(/ /g, "")}`} style={styles.navLink}>
            {t} Leaderboard
          </Link>
        ))}
      </div>

      {/* 2×2 on desktop, 1‑column on mobile */}
      <div className="teams-grid">
        {TOURNAMENTS.map((tournament, idx) => {
          let teams = { 1: [], 2: [] };
          let formLink = "#";
          if (tournament === "Masters") {
            teams = mastersTeams;
            formLink = `https://script.google.com/macros/s/AKfycbyM_KcivAteMOC_SAKZZkMBDEfqj9ep7gfFOzIxTn2LtDSTfs-O_O1McU9D8jmbADOfhw/exec?email=${encodeURIComponent(email)}`;
          } else if (tournament === "PGA") {
            teams = pgaTeams;
            formLink = `https://script.google.com/macros/s/AKfycbz44QE8_JF30JJ5DlGn1LbNj61-G8TIfHre8ysmj2RV0yRsymMBKcP5A8hbgvaMWChgRw/exec?email=${encodeURIComponent(email)}`;
          } else if (tournament === "US Open") {
            teams = usOpenTeams;
            formLink = `https://script.google.com/macros/s/AKfycbw4lNEjB79XT1yc1NtSJ8_hd9v9xG0oyqvEDfZGR6hYoIikQhp8ndx4KHv5cEZBPs1LCQ/exec?email=${encodeURIComponent(email)}`;
          } else if (tournament === "The Open") {
            teams = theOpenTeams;
            formLink = `https://script.google.com/macros/s/AKfycbxvrk7mewm9tXV4Z7lHj1E_SieONu4EhEebbytmpQ1yeVvWXBTz181wXrLftgHMhm5yAQ/exec?email=${encodeURIComponent(email)}`;
          }

          const status = tournamentStatuses[tournament];

          return (
            <div
              key={idx}
              className={status === "current" ? "glow-border team-card" : "team-card"}
              style={styles.card}
            >
              <h3 style={styles.cardTitle}>
                <u>{tournament}</u>
                {status === "current" && <span style={styles.statusTag}>Current</span>}
                {status === "upcoming" ? (
                  <span style={styles.upcomingStatus}>Upcoming</span>
                ) : now < cutoffTimes[tournament] ? (
                  <a href={formLink} target="_blank" rel="noreferrer" style={styles.edit}>
                    Enter/Edit
                  </a>
                ) : (
                  <span style={styles.closed}>Entries Closed</span>
                )}
              </h3>
              <div className="team-row">
                <TeamList teamName="Team 1" players={teams[1]} />
                <TeamList teamName="Team 2" players={teams[2]} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TeamList({ teamName, players }) {
  return (
    <div style={{ flex: 1 }}>
      <p style={styles.teamLabel}>{teamName}</p>
      {players.length === 5 ? (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {players.map((p, i) => (
            <li key={i} style={styles.player}>{p}</li>
          ))}
        </ul>
      ) : (
        <p style={{ color: "#888", fontStyle: "italic" }}>No Entry</p>
      )}
    </div>
  );
}

const styles = {
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "2rem",
    color: "#FFD700",
    textAlign: "center",
    textShadow: "1px 1px 2px rgba(0,0,0,0.6)",
  },
  navLink: {
    fontSize: "0.95rem",
    color: "#FFD700",
    textDecoration: "none",
    fontWeight: "600",
    padding: "0.25rem 0.5rem",
    border: "1px solid #FFD700",
    borderRadius: "6px",
    transition: "all 0.2s ease",
  },
  emailHeader: {
    color: "white",
    fontSize: "1.1rem",
    marginBottom: "2rem",
    fontWeight: 500,
    textAlign: "center",
  },
  card: {
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    borderRadius: "12px",
    padding: "1.5rem",
    margin: "0.5rem",
  },
  cardTitle: {
    fontSize: "1.2rem",
    color: "#FFD700",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  statusTag: { fontSize: "0.8rem", color: "#00FFD0" },
  upcomingStatus: { marginLeft: "auto", fontSize: "0.9rem", color: "#888", fontStyle: "italic" },
  edit:           { marginLeft: "auto", fontSize: "0.9rem", color: "#0f0" },
  closed:         { marginLeft: "auto", fontSize: "0.9rem", color: "#f00" },
  teamLabel:      { fontWeight: "bold", color: "#4CAF50", marginBottom: "0.5rem" },
  player:         { color: "#ddd", marginBottom: "0.3rem" },
};
