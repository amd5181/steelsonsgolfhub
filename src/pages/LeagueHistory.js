import React from "react";
import { Link } from "react-router-dom";

export default function LeagueHistory() {
  const winCounts = {};
  const top3Counts = {};
  const lastWinYear = {};
  const lastTop3Year = {};

  cards.forEach((card) => {
    const { year, gold, silver, bronze } = card;

    winCounts[gold] = (winCounts[gold] || 0) + 1;
    if (!lastWinYear[gold]) lastWinYear[gold] = year;

    [gold, silver, bronze].forEach((name) => {
      top3Counts[name] = (top3Counts[name] || 0) + 1;
      if (!lastTop3Year[name]) lastTop3Year[name] = year;
    });
  });

  const topWins = Object.entries(winCounts)
    .sort((a, b) => {
      if (b[1] === a[1]) {
        return Number(lastWinYear[b[0]]) - Number(lastWinYear[a[0]]);
      }
      return b[1] - a[1];
    })
    .slice(0, 3);

  const topTop3s = Object.entries(top3Counts)
    .sort((a, b) => {
      if (b[1] === a[1]) {
        return Number(lastTop3Year[b[0]]) - Number(lastTop3Year[a[0]]);
      }
      return b[1] - a[1];
    })
    .slice(0, 3);

  return (
<div style={{ ...styles.page, position: "relative", zIndex: 1 }}>
<div style={styles.backLink}>
      </div>

      <h1 style={styles.header}>Hall of Champions</h1>

      <div style={styles.statsBox}>
        <div style={styles.statBlock}>
          <h3 style={styles.statTitle}>🥇 Most Wins</h3>
          <ol style={styles.statList}>
            {topWins.map(([name, count], i) => (
              <li key={i}>
                {i === 0 && "🥇 "}
                {i === 1 && "🥈 "}
                {i === 2 && "🥉 "}
                {name} ({count})
              </li>
            ))}
          </ol>
        </div>

        <div style={styles.statBlock}>
          <h3 style={styles.statTitle}>🏅 Most Top 3 Finishes</h3>
          <ol style={styles.statList}>
            {topTop3s.map(([name, count], i) => (
              <li key={i}>
                {i === 0 && "🥇 "}
                {i === 1 && "🥈 "}
                {i === 2 && "🥉 "}
                {name} ({count})
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div style={styles.grid}>
        {cards.map((card, i) => (
          <div key={i} style={styles.card}>
            <h2 style={styles.year}>{card.year} – Masters</h2>
            <ol style={styles.list}>
              <li>🥇 {card.gold}</li>
              <li>🥈 {card.silver}</li>
              <li>🥉 {card.bronze}</li>
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}

const cards = [
  { year: "2025", gold: "Justin Blazel", silver: "Carson Custer", bronze: "Toby Cressman" },
  { year: "2024", gold: "Andy Albert", silver: "Ian Very", bronze: "Matt Walker" },
  { year: "2023", gold: "Andrew David", silver: "Colin Scarola", bronze: "Justin Rosenthal" },
  { year: "2022", gold: "Justin Blazel", silver: "Rob Platz", bronze: "Andrew David" },
  { year: "2021", gold: "Matt Cheyne", silver: "Andrew David", bronze: "Sam Lanzino" },
  { year: "2020", gold: "Alan McBride", silver: "Matt Ward", bronze: "Sam Lanzino" },
  { year: "2019", gold: "Carson Custer", silver: "Mike Zalac", bronze: "Matt Ward" },
  { year: "2018", gold: "Carson Custer", silver: "Matt Hill", bronze: "Carson Custer" },
  { year: "2017", gold: "Sam Lanzino", silver: "Matt Hill", bronze: "Aaron Levine" },
  { year: "2016", gold: "Dylan Frank", silver: "Andrew David", bronze: "Curtis David" }
];

const styles = {
  page: {
    fontFamily: "'Inter', sans-serif",
    color: "white",
    minHeight: "100vh",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
  },
  backLink: {
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  backAnchor: {
    color: "#facc15",
    fontSize: "0.85rem",
    textDecoration: "none",
  },
  header: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "2rem",
    textAlign: "center",
    background: "linear-gradient(to right, #facc15, #fde68a, #facc15)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textTransform: "uppercase",
    marginBottom: "1rem",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
  },
  statsBox: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "2rem",
    marginBottom: "2.5rem",
    textAlign: "center",
  },
  statBlock: {
    minWidth: "220px",
    flex: "1 1 300px",
  },
  statTitle: {
    color: "#facc15",
    fontSize: "1.25rem",
    marginBottom: "0.5rem",
    fontWeight: 600,
  },
  statList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    fontSize: "0.95rem",
    lineHeight: "1.6",
    color: "#eee",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "1rem",
    width: "100%",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  card: {
    background: "rgba(255, 255, 255, 0.08)",
    border: "1px solid #facc15",
    borderRadius: "0.75rem",
    padding: "1rem",
    backdropFilter: "blur(6px)",
    boxShadow: "0 4px 10px rgba(255, 255, 0, 0.08)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  year: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.25rem",
    color: "#facc15",
    textAlign: "center",
    marginBottom: "0.75rem",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    fontSize: "0.95rem",
    textAlign: "center",
    lineHeight: "1.6",
  },
};
