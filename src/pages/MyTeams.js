import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";

const TOURNAMENTS = ["Masters", "PGA", "US Open", "The Open"];
const urls = {
  Masters:
    "https://script.google.com/macros/s/AKfycbzwgBuOrnxHL8qgDPM7JtwjKrdPiF3cOvxkGln3hBp5E-ApEbEfsE5v125ioFFeW46Mrg/exec",
  PGA:
    "https://script.google.com/macros/s/AKfycbxER3yi16qh1MPN3W7Ta-L3TrE6mG9CqytsCVAatHvMbbuv-VAW3-3alTMDGF7ySdCufQ/exec",
  "US Open":
    "https://script.google.com/macros/s/AKfycbwo0R6zFKsOfyxgns-v5ubBUfqjRXjllvH1FpLDcK3As4Byb2O_hG7k3QbQxvY2iOw5RA/exec",
  "The Open":
    "https://script.google.com/macros/s/AKfycbxvrk7mewm9tXV4Z7NfcwrQ2wvLftgHMhm5yAQ/exec?mode=json",
};

export default function MyTeams() {
  const location = useLocation();
  const email = location.state?.email || "unknown";

  // Separate state per tournament (as you originally had)
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

  // Fetch helper
  useEffect(() => {
    async function fetchTeams(url, setter) {
      try {
        const resp = await fetch(`${url}?email=${encodeURIComponent(email)}`);
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

    fetchTeams(`${urls.Masters}`, setMastersTeams);
    fetchTeams(`${urls.PGA}`, setPgaTeams);
    fetchTeams(`${urls["US Open"]}`, setUsOpenTeams);
    fetchTeams(`${urls["The Open"]}`, setTheOpenTeams);
  }, [email]);

  // Determine statuses: closed, current, upcoming
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

  return (
    <div className="overlay" style={{ paddingTop: "2rem" }}>
      {/* ——— Nav Header ——— */}
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
          <Link to="/" style={styles.navLink}>
            Home
          </Link>
          <Link to="/history" style={styles.navLink}>
            History
          </Link>
        </div>
      </div>

      {/* ——— Email Header ——— */}
      <h2 style={styles.emailHeader}>
        My Teams — <span style={{ fontWeight: 700 }}>{email}</span>
      </h2>

      {/* ——— The Grid ——— */}
      <div className="teams-grid">
        {TOURNAMENTS.map((tournament) => {
          let teams, formLink;
          switch (tournament) {
            case "Masters":
              teams = mastersTeams;
              formLink = `${urls.Masters}?email=${encodeURIComponent(email)}`;
              break;
            case "PGA":
              teams = pgaTeams;
              formLink = `${urls.PGA}?email=${encodeURIComponent(email)}`;
              break;
            case "US Open":
              teams = usOpenTeams;
              formLink = `${urls["US Open"]}?email=${encodeURIComponent(email)}`;
              break;
            case "The Open":
              teams = theOpenTeams;
              formLink = `${urls["The Open"]}?email=${encodeURIComponent(email)}`;
              break;
            default:
              teams = { 1: [], 2: [] };
              formLink = "#";
          }

          const status = tournamentStatuses[tournament];
          const cutoff = cutoffTimes[tournament];
          const cutoffPlus7 = new Date(cutoff.getTime() + 7 * 24 * 60 * 60 * 1000);

          return (
            <div
              key={tournament}
              className={status === "current" ? "glow-border team-card" : "team-card"}
              style={styles.card}
            >
              <h3 style={styles.cardTitle}>
                <u>{tournament}</u>
                {/* Status Tag */}
                {status === "current" && (
                  <span style={styles.statusTag}>Current</span>
                )}
                {status === "upcoming" ? (
                  <span style={styles.upcomingStatus}>Upcoming</span>
                ) : now < cutoff ? (
                  <a
                    href={formLink}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.edit}
                  >
                    Enter/Edit
                  </a>
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

// ——— TeamList (unchanged) ———
function TeamList({ teamName, players }) {
  return (
    <div style={{ flex: 1 }}>
      <p style={styles.teamLabel}>{teamName}</p>
      {players.length === 5 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {players.map((p, i) => (
            <li key={i} style={styles.player}>
              {p}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: "#888", fontStyle: "italic" }}>No Entry</p>
      )}
    </div>
  );
}

// ——— Inline style objects you’d defined ———
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
  statusTag: {
    fontSize: "0.8rem",
    color: "#00FFD0",
    marginLeft: "0.5rem",
  },
  upcomingStatus: {
    marginLeft: "auto",
    fontSize: "0.9rem",
    color: "#888",
    fontStyle: "italic",
  },
  edit: {
    marginLeft: "auto",
    fontSize: "0.9rem",
    color: "#0f0",
  },
  closed: {
    marginLeft: "auto",
    fontSize: "0.9rem",
    color: "#f00",
  },
  teamRow: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
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
