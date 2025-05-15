import { useEffect, useState, useRef } from "react";

const TOURNAMENTS = [
  {
    key: "masters",
    name: "Masters",
    range: "Masters Leaderboard!A1:Z1000",
    startDate: new Date("2025-04-10T09:00:00-04:00"),
    endDate: new Date("2025-04-14T23:59:59-04:00"),
  },
  {
    key: "pga",
    name: "PGA Championship",
    range: "PGA Leaderboard!A1:Z1000",
    startDate: new Date("2025-05-15T09:00:00-04:00"),
    endDate: new Date("2025-05-19T23:59:59-04:00"),
  },
  {
    key: "usopen",
    name: "US Open",
    range: "US Open Leaderboard!A1:Z1000",
    startDate: new Date("2025-06-12T09:00:00-04:00"),
    endDate: new Date("2025-06-16T23:59:59-04:00"),
  },
  {
    key: "theopen",
    name: "The Open",
    range: "The Open Leaderboard!A1:Z1000",
    startDate: new Date("2025-07-17T09:00:00-04:00"),
    endDate: new Date("2025-07-21T23:59:59-04:00"),
  },
];

const API_KEY = "AIzaSyC-0Zrg5OARvAqSmyK8P8lkJqVCccGjrF4";
const SPREADSHEET_ID = "1Nx_8Mkf3U14civkKD5b5sgXL8yVpErC1g-9rC1Z1hbM";

export default function Leaderboards() {
  const [activeTab, setActiveTab] = useState("");
  const [data, setData] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshCountdown, setRefreshCountdown] = useState(20);
  const [collapsed, setCollapsed] = useState(false);
  const intervalRef = useRef();

  useEffect(() => {
    const now = new Date();
    const current = TOURNAMENTS.find(t => now >= t.startDate && now <= t.endDate);
    const next = TOURNAMENTS.find(t => now < t.startDate) || TOURNAMENTS[TOURNAMENTS.length - 1];
    setActiveTab(current ? current.key : next.key);
  }, []);

  useEffect(() => {
    if (!activeTab) return;
    const tournament = TOURNAMENTS.find(t => t.key === activeTab);
    if (!tournament) return;

    const fetchData = () => {
      const encodedRange = encodeURIComponent(tournament.range);
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodedRange}?key=${API_KEY}`;
      fetch(url, { cache: "no-store" })
        .then(res => res.json())
        .then(dataResp => {
          const rows = dataResp?.values;
          if (!rows || rows.length === 0) return;
          const mainData = rows.slice(0, 300);
          const sideData = rows.slice(1, 12).map(r => r.slice(17, 19));
          setData(prev => ({ ...prev, [tournament.key]: { mainData, sideData } }));
          setLastUpdated(new Date().toLocaleTimeString());
        });
    };

    fetchData();
    clearInterval(intervalRef.current);
    let countdown = 20;
    intervalRef.current = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        fetchData();
        countdown = 20;
      }
      setRefreshCountdown(countdown);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [activeTab]);

  const tournament = TOURNAMENTS.find(t => t.key === activeTab);
  const now = new Date();
  const tournamentStarted = tournament ? now >= tournament.startDate : false;
  const activeData = data[activeTab] || {};

  return (
    <div className="leaderboard-wrapper dark" style={{ padding: "1rem", position: "relative", zIndex: 1 }}>
      <div style={styles.tabs}>
        {TOURNAMENTS.map(t => {
          const isCurrent = t.key === activeTab;
          const isOngoing = now >= t.startDate && now <= t.endDate;
          const isPast = now > t.endDate;
          const tabStyle = {
            ...styles.tabBtn,
            ...(isCurrent
              ? styles.currentTab
              : isPast
              ? styles.pastTab
              : styles.upcomingTab),
          };
          return (
            <button key={t.key} onClick={() => setActiveTab(t.key)} style={tabStyle}>
              {t.name}
            </button>
          );
        })}
      </div>

      <div style={styles.titleBox}>
        <h1 style={styles.title}>Steel Sons</h1>
        <h2 style={styles.subtitle}>{tournament?.name} Pool Leaderboard</h2>
      </div>

      {!tournamentStarted ? (
        <div style={styles.waitText}>Tournament Has Not Started. Check Back In Later!</div>
      ) : (
        <>
          <div className="refresh-bar">
            Last updated: {lastUpdated} — Refreshing in {refreshCountdown}s
          </div>

          <div className="leaderboard-grid">
            <div className="standings-box">
              <h2 className="text-header">Real-Time Standings</h2>
              <button onClick={() => setCollapsed(!collapsed)} className="collapse-btn">
                {collapsed ? "Expand View" : "Collapse View"}
              </button>

              {activeData.mainData?.length > 2 ? (
                <div className="table-wrapper">
                  <table className="standings-table">
                    <thead>
                      {!collapsed && (
                        <tr className="group-header">
                          {activeData.mainData[1]?.slice(0, 12).map((_, j) => (
                            j === 6 ? <th key="completed-header" colSpan={4}>Completed Rounds</th> :
                            j === 10 ? <th key="current-header" colSpan={2}>Current Round</th> :
                            j < 6 ? <th key={j}></th> : null
                          ))}
                        </tr>
                      )}
                      <tr className="group-header border-b-yellow">
                        {(collapsed ? [0, 1, 4] : [...Array(12).keys()]).map(j => (
                          <th key={j} className={!collapsed && [4, 5, 9].includes(j) ? "border-r-yellow" : ""}>
                            {activeData.mainData[1]?.[j]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {activeData.mainData.slice(2).map((row, i) => {
                        const idx = i + 3;
                        const show = !collapsed || [3, 8, 13, 18].includes(idx) || idx % 5 === 3;
                        if (!show) return null;
                        return (
                          <tr key={i} className={idx === 3 || idx % 5 === 3 ? "team-divider" : ""}>
                            {(collapsed ? [0, 1, 4] : [...Array(12).keys()]).map(j => (
                              <td key={j} className={!collapsed && [4, 5, 9].includes(j) ? "border-r-yellow" : ""}>
                                {row[j]}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : <p className="loading-text">Loading data...</p>}
            </div>

            <div className="masters-box">
              <h2 className="text-header">{tournament?.name} Leaderboard</h2>
              <table className="masters-table">
                <thead className="group-header">
                  <tr><th>Current Top 10</th><th>Score</th></tr>
                </thead>
                <tbody>
                  {activeData.sideData?.map((r, i) => (
                    <tr key={i}><td>{r[0]}</td><td>{r[1]}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  tabs: {
    marginTop: "3.5rem",
    marginBottom: "1.5rem",
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },
  tabBtn: {
    padding: "0.4rem 1.1rem",
    borderRadius: "6px",
    border: "1px solid #FFD700",
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "0.2s all",
    background: "#333",
    color: "#FFD700",
  },
  currentTab: {
    backgroundColor: "#FFD700",
    color: "#000",
    fontWeight: 700,
  },
  upcomingTab: {
    backgroundColor: "#333",
    color: "#FFD700",
  },
  pastTab: {
    backgroundColor: "#111",
    color: "#666",
    borderColor: "#444",
    cursor: "pointer",
  },
  titleBox: {
    textAlign: "center",
    marginBottom: "1rem",
  },
  title: {
    fontSize: "2.4rem",
    fontWeight: 700,
    color: "#FFD700",
    margin: 0,
    textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
  },
  subtitle: {
    fontSize: "1.2rem",
    fontWeight: 400,
    color: "white",
    marginTop: "0.25rem",
    textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
  },
  waitText: {
    textAlign: "center",
    marginTop: "3rem",
    fontSize: "1.3rem",
    color: "#FFD700",
  },
};
