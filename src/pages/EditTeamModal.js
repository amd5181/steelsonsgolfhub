import React, { useEffect, useState } from "react";

export default function EditTeamModal({ isOpen, onClose, tournament, email, fullName }) {
  const [golferList, setGolferList] = useState([]);
  const [team1, setTeam1] = useState(Array(5).fill(""));
  const [team2, setTeam2] = useState(Array(5).fill(""));
  const [team1Salary, setTeam1Salary] = useState(0);
  const [team2Salary, setTeam2Salary] = useState(0);
  const SALARY_CAP = 1000000;

  const sheetMap = {
    "Masters": "Masters Entries",
    "US Open": "US Open Entries",
    "The Open": "The Open Entries",
    "PGA": "PGA Entries"
  };

  const scriptUrl = "https://script.google.com/macros/s/AKfycbx6S4j30b5u8Gg7jwuBotw0x-Svh1DzUV0523ZABuqb0kIZUXU4iRLrB_kJtLMVJQ0o_w/exec";

  useEffect(() => {
    if (!isOpen || !tournament) return;

    const sheetName = sheetMap[tournament];

    console.log("🏌️ Tournament passed to modal:", tournament);
    console.log("📄 Resolved sheet name:", sheetName);

    if (!sheetName) {
      console.error("❌ Invalid tournament:", tournament);
      return;
    }

    // Fetch golfer list
    fetch(`${scriptUrl}?mode=golfers&tournament=${encodeURIComponent(sheetName)}`)
      .then(res => res.json())
      .then(data => setGolferList(data))
      .catch(err => console.error("❌ Failed to load golfers", err));

    // Fetch existing entries
    fetch(`${scriptUrl}?mode=entries&tournament=${encodeURIComponent(sheetName)}&email=${encodeURIComponent(email)}`)
      .then(res => res.json())
      .then(data => {
        const team1Data = data.filter(row => row.team === 1).map(row => row.golfer);
        const team2Data = data.filter(row => row.team === 2).map(row => row.golfer);
        setTeam1([...team1Data, ...Array(5 - team1Data.length).fill("")]);
        setTeam2([...team2Data, ...Array(5 - team2Data.length).fill("")]);
      })
      .catch(err => console.error("❌ Failed to load entries", err));
  }, [isOpen, tournament, email]);

  useEffect(() => {
    setTeam1Salary(getTeamSalary(team1));
    setTeam2Salary(getTeamSalary(team2));
  }, [team1, team2, golferList]);

  const getTeamSalary = (team) => {
    return team.reduce((sum, name) => {
      const match = golferList.find(g => g.name === name);
      return sum + (match ? parseInt(match.salary) : 0);
    }, 0);
  };

  const handleChange = (teamIndex, golferIndex, value) => {
    const updateFn = teamIndex === 1 ? setTeam1 : setTeam2;
    const team = teamIndex === 1 ? [...team1] : [...team2];
    team[golferIndex] = value;
    updateFn(team);
  };

  const handleSave = () => {
    const sheetName = sheetMap[tournament];
    if (!sheetName) {
      console.error("❌ Cannot save, invalid tournament:", tournament);
      return;
    }

    const body = {
      mode: "submit",
      tournament: sheetName,
      email,
      fullName,
      entries: [
        ...team1.map(golfer => ({ team: 1, golfer })),
        ...team2.map(golfer => ({ team: 2, golfer }))
      ]
    };

    fetch(scriptUrl, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(() => onClose())
      .catch(err => console.error("❌ Save failed", err));
  };

  if (!isOpen) return null;

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Edit Teams – {tournament}</h2>
        <p style={styles.subtitle}>{fullName} ({email})</p>

        <div style={styles.teamRow}>
          {[1, 2].map(teamIndex => (
            <div key={teamIndex} style={styles.teamBox}>
              <h3 style={styles.teamTitle}>Team {teamIndex}</h3>
              {[0, 1, 2, 3, 4].map(i => (
                <select
                  key={i}
                  value={(teamIndex === 1 ? team1[i] : team2[i]) || ""}
                  onChange={(e) => handleChange(teamIndex, i, e.target.value)}
                  style={styles.select}
                >
                  <option value="">Select Golfer</option>
                  {golferList.map((golfer) => (
                    <option key={golfer.name} value={golfer.name}>
                      {golfer.name} (${parseInt(golfer.salary).toLocaleString()})
                    </option>
                  ))}
                </select>
              ))}
              <p style={{ color: (teamIndex === 1 ? team1Salary : team2Salary) > SALARY_CAP ? "red" : "#FFD700" }}>
                Total Salary: ${(teamIndex === 1 ? team1Salary : team2Salary).toLocaleString()} / $1,000,000
              </p>
            </div>
          ))}
        </div>

        <div style={styles.actions}>
          <button onClick={handleSave} style={styles.save}>Save</button>
          <button onClick={onClose} style={styles.cancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000
  },
  modal: {
    backgroundColor: "#111",
    padding: "2rem",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "900px",
    color: "white",
    boxShadow: "0 0 20px #000"
  },
  title: {
    fontSize: "1.8rem",
    color: "#FFD700",
    marginBottom: "0.5rem"
  },
  subtitle: {
    color: "#ccc",
    fontSize: "1rem",
    marginBottom: "1.5rem"
  },
  teamRow: {
    display: "flex",
    gap: "2rem",
    justifyContent: "space-between"
  },
  teamBox: {
    flex: 1
  },
  teamTitle: {
    color: "#4CAF50",
    marginBottom: "0.75rem"
  },
  select: {
    width: "100%",
    padding: "0.5rem",
    marginBottom: "0.5rem",
    borderRadius: "6px",
    backgroundColor: "#222",
    color: "white",
    border: "1px solid #555"
  },
  actions: {
    marginTop: "2rem",
    display: "flex",
    justifyContent: "flex-end",
    gap: "1rem"
  },
  save: {
    backgroundColor: "#FFD700",
    color: "black",
    padding: "0.5rem 1.25rem",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  cancel: {
    backgroundColor: "#444",
    color: "white",
    padding: "0.5rem 1.25rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }
};
