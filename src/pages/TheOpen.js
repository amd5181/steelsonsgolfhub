import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

export default function TheOpenLeaderboard() {
  const [mainData, setMainData] = useState([]);
  const [theOpenData, setTheOpenData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshCountdown, setRefreshCountdown] = useState(20);
  const [collapsed, setCollapsed] = useState(false);

  const previousMainData = useRef([]);
  const previousTheOpenData = useRef([]);

  const API_KEY = "AIzaSyC-0Zrg5OARvAqSmyK8P8lkJqVCccGjrF4";
  const SPREADSHEET_ID = "1Nx_8Mkf3U14civkKD5b5sgXL8yVpErC1g-9rC1Z1hbM";
  const RANGE = "The Open Leaderboard!A1:Z1000";
  const encodedRange = encodeURIComponent(RANGE);

  const tournamentStart = new Date("2025-07-17T10:00:00-04:00");
  const now = new Date();
  const tournamentStarted = now >= tournamentStart;

  const fetchData = () => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodedRange}?key=${API_KEY}`;
    fetch(url, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.error("API error:", data.error.message);
          return;
        }

        const rows = data.values;
        if (!rows || rows.length === 0) return;

        const newMain = rows.slice(0, 300);
        const newTheOpen = rows.slice(1, 12).map((r) => r.slice(17, 19));

        const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
        if (!isEqual(previousMainData.current, newMain)) {
          previousMainData.current = newMain;
          setMainData(newMain);
        }
        if (!isEqual(previousTheOpenData.current, newTheOpen)) {
          previousTheOpenData.current = newTheOpen;
          setTheOpenData(newTheOpen);
        }

        setLastUpdated(new Date().toLocaleTimeString());
      })
      .catch((err) => console.error("Fetch error:", err));
  };

  useEffect(() => {
    fetchData();
    let countdown = 20;
    const intervalId = setInterval(() => {
      countdown -= 1;
      if (countdown <= 0) {
        fetchData();
        countdown = 20;
      }
      setRefreshCountdown(countdown);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="leaderboard-wrapper dark" style={{ position: "relative", padding: "1rem" }}>
      <div style={{ position: "absolute", top: "1rem", right: "1.5rem", display: "flex", gap: "0.75rem" }}>
        <Link to="/" style={navLinkStyle}>Home</Link>
        <Link to="/history" style={navLinkStyle}>History</Link>
      </div>

      <div style={{ textAlign: "center", marginTop: "3.5rem", marginBottom: "1rem" }}>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 700, color: "#FFD700", margin: 0 }}>Steel Sons</h1>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 400, color: "white", marginTop: "0.25rem" }}>
          The Open Leaderboard
        </h2>
      </div>

      {tournamentStarted ? (
        <>
          <div className="refresh-bar" style={{ textAlign: "center", marginBottom: "1rem", fontSize: "0.85rem", color: "#ccc" }}>
            Last updated: {lastUpdated} — Refreshing in {refreshCountdown}s
          </div>

          <div className="leaderboard-grid" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div className="standings-box">
              <h2 className="text-header" style={{ color: "#FFD700", fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                Real-Time Standings
              </h2>
              <button onClick={() => setCollapsed(!collapsed)} className="collapse-btn" style={collapseBtnStyle}>
                {collapsed ? "Expand View" : "Collapse View"}
              </button>

              {mainData.length > 2 ? (
                <div className="table-wrapper" style={{ overflowX: "auto" }}>
                  <table className="standings-table" style={tableStyle}>
                    <thead>
                      {!collapsed && (
                        <tr style={groupHeaderStyle}>
                          {mainData[1]?.slice(0, 12).map((_, j) => {
                            if (j === 6) return <th key="completed-header" colSpan={4}>Completed Rounds</th>;
                            if (j === 10) return <th key="current-header" colSpan={2}>Current Round</th>;
                            return j < 6 ? <th key={j}></th> : null;
                          })}
                        </tr>
                      )}
                      <tr style={groupHeaderStyle}>
                        {(collapsed ? [0, 1, 4] : Array.from({ length: 12 }, (_, j) => j)).map((j) => (
                          <th key={j}>{mainData[1]?.[j]}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mainData.slice(2).map((row, i) => {
                        const displayRowIndex = i + 3;
                        const shouldDisplay =
                          !collapsed ||
                          displayRowIndex === 3 ||
                          displayRowIndex === 8 ||
                          displayRowIndex === 13 ||
                          displayRowIndex === 18 ||
                          displayRowIndex % 5 === 3;

                        if (!shouldDisplay) return null;
                        const isDivider = displayRowIndex === 3 || displayRowIndex % 5 === 3;

                        return (
                          <tr key={i} className={isDivider ? "team-divider" : ""}>
                            {(collapsed ? [0, 1, 4] : Array.from({ length: 12 }, (_, j) => j)).map((j) => {
                              const showBorder = !collapsed && (j === 4 || j === 5 || j === 9);
                              const className = showBorder ? "border-r-yellow" : "";
                              return (
                                <td key={j} className={className} style={{ padding: "0.25rem 0.5rem", whiteSpace: "nowrap" }}>
                                  {row[j]}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="loading-text" style={{ color: "#ccc" }}>Loading data...</p>
              )}
            </div>

            <div className="masters-box">
              <h2 className="text-header" style={{ color: "#FFD700", fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                The Open Leaderboard
              </h2>
              <table className="masters-table" style={tableStyle}>
                <thead>
                  <tr>
                    <th>Current Top 10</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {theOpenData
                    .filter((row) => row[0] !== "Current Top 10" && row[1] !== "Score")
                    .map((row, i) => (
                      <tr key={i}>
                        <td>{row[0]}</td>
                        <td>{row[1]}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", marginTop: "3rem", fontSize: "1.3rem", color: "#FFD700" }}>
          Tournament Has Not Started. Check Back In Later!
        </div>
      )}
    </div>
  );
}

const navLinkStyle = {
  fontSize: "0.85rem",
  color: "#FFD700",
  textDecoration: "none",
  fontWeight: "600",
  padding: "0.3rem 0.6rem",
  border: "1px solid #FFD700",
  borderRadius: "6px",
  transition: "all 0.2s ease",
  textShadow: "1px 1px 2px rgba(0,0,0,0.8)"
};

const collapseBtnStyle = {
  marginBottom: "0.75rem",
  padding: "0.4rem 0.75rem",
  fontSize: "0.85rem",
  backgroundColor: "#333",
  color: "#FFD700",
  border: "1px solid #FFD700",
  borderRadius: "5px",
  cursor: "pointer"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.8rem"
};

const groupHeaderStyle = {
  backgroundColor: "#222",
  color: "#FFD700",
  fontWeight: "600"
};
