import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

const SALARY_CAP = 1000000;
const scriptUrl = "https://script.google.com/macros/s/AKfycbz8ArrDYvfwqEkm1liFEe7EeWKD_QThhqzVp3QXF4O-YfH70chFA_5pGrUIroOqnAD3kg/exec";

export default function TeamEntryForm() {
  const { tournament } = useParams();
  const location = useLocation();
  const email = location.state?.email || "";

  const [fullName, setFullName] = useState("");
  const [showNameField, setShowNameField] = useState(false);
  const [golfers, setGolfers] = useState([]);
  const [team1, setTeam1] = useState(Array(5).fill(""));
  const [team2, setTeam2] = useState(Array(5).fill(""));

  useEffect(() => {
    fetch(`${scriptUrl}?mode=golfers&tournament=${encodeURIComponent(tournament)} Entries`)
      .then(res => res.json())
      .then(data => setGolfers(data));

    fetch(`${scriptUrl}?mode=entries&tournament=${encodeURIComponent(tournament)} Entries&email=${encodeURIComponent(email)}`)
      .then(res => res.json())
      .then(data => {
        if (!data || data.length === 0) setShowNameField(true);

        const t1 = data.filter(d => d.team === 1).map(d => d.golfer.replace(" (2)", ""));
        const t2 = data.filter(d => d.team === 2).map(d => d.golfer.replace(" (2)", ""));

        setTeam1([...t1, ...Array(5 - t1.length).fill("")]);
        setTeam2([...t2, ...Array(5 - t2.length).fill("")]);
      });
  }, [tournament, email]);

  const handleChange = (team, index, value) => {
    const setter = team === 1 ? setTeam1 : setTeam2;
    const current = team === 1 ? [...team1] : [...team2];
    current[index] = value;
    setter(current);
  };

  const getTeamSalary = (team) => {
    return team.reduce((sum, name) => {
      const match = golfers.find(g => g.name === name);
      return sum + (match ? parseInt(match.salary) : 0);
    }, 0);
  };

  const handleSubmit = () => {
    if (showNameField && fullName.trim() === "") {
      alert("Please enter your full name.");
      return;
    }

    const entries = [
      ...team1.map(name => ({
        team: 1,
        golfer: name,
        salary: golfers.find(g => g.name === name)?.salary || ""
      })),
      ...team2.map(name => ({
        team: 2,
        golfer: name,
        salary: golfers.find(g => g.name === name)?.salary || ""
      }))
    ];

    const body = {
      tournament: `${tournament} Entries`,
      email,
      fullName,
      entries
    };

    fetch(scriptUrl, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(() => alert("Teams submitted successfully!"))
      .catch(err => alert("Submission failed."));
  };

  const isDisabled = (teamIndex, name) =>
    (team1.includes(name) && teamIndex === 2) ||
    (team2.includes(name) && teamIndex === 1);

  return (
    <div className="overlay">
      <h1>Steel Sons Golf Hub</h1>
      <p style={{ textAlign: "center", color: "#ccc", marginBottom: "2rem" }}>
        {tournament} — {email}
      </p>

      {showNameField && (
        <div style={{ maxWidth: 400, margin: "0 auto", marginBottom: "2rem" }}>
          <label>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Andrew David"
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "8px",
              backgroundColor: "#111",
              border: "1px solid #FFD700",
              color: "#fff"
            }}
          />
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "2rem", marginBottom: "2rem" }}>
        <TeamSelector
          teamNumber={1}
          team={team1}
          handleChange={handleChange}
          getTeamSalary={getTeamSalary}
          golfers={golfers}
          isDisabled={isDisabled}
        />
        <TeamSelector
          teamNumber={2}
          team={team2}
          handleChange={handleChange}
          getTeamSalary={getTeamSalary}
          golfers={golfers}
          isDisabled={isDisabled}
        />
      </div>

      <div style={{ textAlign: "center" }}>
        <button onClick={handleSubmit} className="submit-button">
          Submit Teams
        </button>
      </div>
    </div>
  );
}

function TeamSelector({ teamNumber, team, handleChange, getTeamSalary, golfers, isDisabled }) {
  return (
    <div style={{
      backgroundColor: "rgba(255,255,255,0.05)",
      padding: "1.25rem",
      borderRadius: "12px",
      border: "1px solid #FFD700",
      width: "100%",
      maxWidth: "400px"
    }}>
      <h2 style={{ color: "#FFD700", textAlign: "center", marginBottom: "1rem" }}>
        Team {teamNumber}
      </h2>

      {team.map((val, i) => (
        <select
          key={i}
          value={val}
          onChange={(e) => handleChange(teamNumber, i, e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem",
            marginBottom: "0.75rem",
            borderRadius: "8px",
            backgroundColor: "#111",
            color: "#fff",
            border: "1px solid #444"
          }}
        >
          <option value="">Select Golfer</option>
          {golfers.map((g) => (
            <option key={g.name} value={g.name} disabled={isDisabled(teamNumber, g.name)}>
              {g.name} (${parseInt(g.salary).toLocaleString()})
            </option>
          ))}
        </select>
      ))}

      <p style={{
        marginTop: "1rem",
        textAlign: "center",
        fontWeight: "bold",
        color: getTeamSalary(team) > SALARY_CAP ? "#ff4d4d" : "#FFD700"
      }}>
        Salary: ${getTeamSalary(team).toLocaleString()} / $1,000,000
      </p>
    </div>
  );
}
