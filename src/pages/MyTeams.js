import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

const TOURNAMENTS = ["Masters", "PGA", "US Open", "The Open"];

export default function MyTeams() {
  const location = useLocation();
  const email = location.state?.email || "unknown";
  const [mastersTeams, setMastersTeams] = useState({ 1: [], 2: [] });
  const [pgaTeams, setPgaTeams] = useState({ 1: [], 2: [] });
  const [usOpenTeams, setUsOpenTeams] = useState({ 1: [], 2: [] });
  const [theOpenTeams, setTheOpenTeams] = useState({ 1: [], 2: [] });

  const now = new Date();
  const cutoffTimes = {
    Masters: new Date("2025-04-10T10:00:00-04:00"),
    PGA: new Date("2025-05-15T10:00:00-04:00"),
    "US Open": new Date("2025-06-12T10:00:00-04:00"),
    "The Open": new Date("2025-07-17T10:00:00-04:00"),
  };

  useEffect(() => {
    async function fetchTeams(url, setFunc) {
      try {
        const response = await fetch(url);
        const data = await response.json();
        const teams = { 1: [], 2: [] };

        data.forEach((entry) => {
          const teamNum = entry.Team.includes("(2)") ? 2 : 1;
          teams[teamNum].push(entry.Golfer);
        });

        setFunc({
          1: teams[1].length === 5 ? teams[1] : [],
          2: teams[2].length === 5 ? teams[2] : [],
        });
      } catch (err) {
        console.error("Error fetching teams:", err);
        setFunc({ 1: [], 2: [] });
      }
    }

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
  }, [email]);

  const getTournamentStatuses = () => {
    const statuses = {};
    let currentSet = false;

    TOURNAMENTS.forEach((tournament) => {
      const cutoff = cutoffTimes[tournament];
      const cutoffPlus7 = new Date(cutoff.getTime() + 7 * 24 * 60 * 60 * 1000);

      if (now > cutoffPlus7) {
        statuses[tournament] = "closed";
      } else if (!currentSet && now < cutoffPlus7) {
        statuses[tournament] = "current";
        currentSet = true;
      } else {
        statuses[tournament] = "upcoming";
      }
    });

    return statuses;
  };

  const tournamentStatuses = getTournamentStatuses();

  return (
    <div className="overlay" style={{ paddingTop: "2rem" }}>
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
        </div>
      </div>

      <h2 style={styles.emailHeader}>
        My Teams — <span style={{ fontWeight: "700" }}>{email}</span>
      </h2>

      <div style={styles.grid}>
        {TOURNAMENTS.map((tournament, index) => {
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
              key={index}
              className={status === "current" ? "glow-border" : ""}
              style={styles.card}
            >
              <h3 style={styles.cardTitle}>
                <u>{tournament}</u>
                {status === "current" && <span style={styles.statusTag}>Current</span>}
                {status === "upcoming" ? (
                  <span style={styles.upcomingStatus}>Upcoming</span>
                ) : now < cutoffTimes[tournament] ? (
                  <a href={formLink} target="_blank" rel="noreferrer" style={styles.edit}>Enter/Edit</a>
                ) : (
                  <span style={styles.closed}>Entries Closed</span>
                )}
              </h3>
              <div style={styles.teamRow}>
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
  const hasEntry = players.length === 5;
  return (
    <div>
      <p style={styles.teamLabel}>{teamName}</p>
      {hasEntry ? (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {players.map((player, idx) => (
            <li key={idx} style={styles.player}>{player}</li>
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
    margin: 0,
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
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "1.5rem",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  card: {
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    border: "1px solid #FFD700",
    borderRadius: "12px",
    padding: "1.5rem",
    color: "white",
  },
  cardTitle: {
    fontSize: "1.2rem",
    color: "#FFD700",
    marginBottom: "1rem",
  },
  statusTag: {
    fontSize: "0.8rem",
    color: "#00FFD0",
    marginLeft: "0.5rem",
  },
  upcomingStatus: {
    fontSize: "0.9rem",
    color: "#888",
    fontStyle: "italic",
    float: "right",
  },
  edit: {
    fontSize: "0.9rem",
    color: "#ccc",
    float: "right",
  },
  closed: {
    fontSize: "0.9rem",
    color: "#888",
    float: "right",
  },
  teamRow: {
    display: "flex",
    flexDirection: "row",  // updated for 2x2 grid layout
    gap: "2rem",
  },
  teamLabel: {
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: "0.5rem",
  },
  player: {
    color: "#ddd",
    marginBottom: "0.3rem",
  },
};
