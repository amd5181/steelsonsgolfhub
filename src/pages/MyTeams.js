import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TeamList from "../TeamEntryForm"; // adjust this import if your TeamList is elsewhere

const TOURNAMENTS = ["Masters", "PGA", "US Open", "The Open"];

export default function MyTeams() {
  const location = useLocation();
  const email = location.state?.email || "unknown";

  const [teamsByTournament, setTeamsByTournament] = useState(
    TOURNAMENTS.reduce((acc, t) => {
      acc[t] = { 1: [], 2: [] };
      return acc;
    }, {})
  );

  const now = new Date();
  const cutoffTimes = {
    Masters: new Date("2025-04-10T10:00:00-04:00"),
    PGA: new Date("2025-05-15T10:00:00-04:00"),
    "US Open": new Date("2025-06-12T10:00:00-04:00"),
    "The Open": new Date("2025-07-17T10:00:00-04:00"),
  };

  useEffect(() => {
    async function fetchTeams(apiUrl, tournament) {
      try {
        const resp = await fetch(`${apiUrl}?email=${encodeURIComponent(email)}`);
        const data = await resp.json();
        const teams = { 1: [], 2: [] };
        data.forEach((entry) => {
          const teamNum = entry.Team.includes("(2)") ? 2 : 1;
          teams[teamNum].push(entry.Golfer);
        });
        setTeamsByTournament((prev) => ({
          ...prev,
          [tournament]: {
            1: teams[1].length === 5 ? teams[1] : [],
            2: teams[2].length === 5 ? teams[2] : [],
          },
        }));
      } catch (err) {
        console.error("Error fetching teams for", tournament, err);
      }
    }

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

    TOURNAMENTS.forEach((t) => {
      fetchTeams(urls[t], t);
    });
  }, [email]);

  return (
    <div className="overlay" style={{ paddingTop: "2rem" }}>
      <div className="teams-grid">
        {TOURNAMENTS.map((tournament) => {
          const teams = teamsByTournament[tournament] || { 1: [], 2: [] };
          const cutoff = cutoffTimes[tournament];
          const formLink = `${urls[tournament]}?email=${encodeURIComponent(email)}`;

          const cutoffPlus7 = new Date(cutoff.getTime() + 7 * 24 * 60 * 60 * 1000);
          let statusElem;
          if (now > cutoffPlus7) {
            statusElem = <span style={{ color: "#f00" }}>Entries Closed</span>;
          } else if (now < cutoff) {
            statusElem = (
              <a
                href={formLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#0f0" }}
              >
                Enter/Edit
              </a>
            );
          } else {
            statusElem = <span style={{ color: "#0af" }}>Current</span>;
          }

          return (
            <div key={tournament} className="team-card">
              <h3 style={{ marginBottom: "1rem" }}>
                {tournament} {statusElem}
              </h3>
              <div className="team-row">
                <TeamList teamName="Team 1" players={teams[1]} />
                <TeamList teamName="Team 2" players={teams[2]} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
