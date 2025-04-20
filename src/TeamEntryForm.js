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
        if (!data || data.length === 0) {
          setShowNameField(true);
        }

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
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <h1 className="text-4xl font-bold text-yellow-400 text-center mb-2">Steel Sons Golf Hub</h1>
      <p className="text-center text-white text-sm mb-6">
        {tournament} — {email}
      </p>

      {showNameField && (
        <div className="max-w-md mx-auto mb-8">
          <label className="block text-yellow-400 font-semibold mb-1">Full Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded bg-black border border-yellow-400 text-white"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Andrew David"
          />
        </div>
      )}

      <div className="flex flex-wrap gap-6 justify-center mb-12">
        <div className="bg-zinc-900 p-6 rounded-lg w-full max-w-md border border-yellow-400">
          <h2 className="text-xl text-yellow-400 font-bold mb-4">Team 1</h2>
          {team1.map((val, i) => (
            <select
              key={i}
              value={val}
              onChange={(e) => handleChange(1, i, e.target.value)}
              className="w-full mb-3 px-3 py-2 rounded bg-black border border-gray-600 text-white"
            >
              <option value="">Select Golfer</option>
              {golfers.map((g) => (
                <option
                  key={g.name}
                  value={g.name}
                  disabled={isDisabled(1, g.name)}
                >
                  {g.name} (${parseInt(g.salary).toLocaleString()})
                </option>
              ))}
            </select>
          ))}
          <p className={`mt-2 font-bold ${getTeamSalary(team1) > SALARY_CAP ? "text-red-400" : "text-yellow-400"}`}>
            Salary: ${getTeamSalary(team1).toLocaleString()} / $1,000,000
          </p>
        </div>

        <div className="bg-zinc-900 p-6 rounded-lg w-full max-w-md border border-yellow-400">
          <h2 className="text-xl text-yellow-400 font-bold mb-4">Team 2</h2>
          {team2.map((val, i) => (
            <select
              key={i}
              value={val}
              onChange={(e) => handleChange(2, i, e.target.value)}
              className="w-full mb-3 px-3 py-2 rounded bg-black border border-gray-600 text-white"
            >
              <option value="">Select Golfer</option>
              {golfers.map((g) => (
                <option
                  key={g.name}
                  value={g.name}
                  disabled={isDisabled(2, g.name)}
                >
                  {g.name} (${parseInt(g.salary).toLocaleString()})
                </option>
              ))}
            </select>
          ))}
          <p className={`mt-2 font-bold ${getTeamSalary(team2) > SALARY_CAP ? "text-red-400" : "text-yellow-400"}`}>
            Salary: ${getTeamSalary(team2).toLocaleString()} / $1,000,000
          </p>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 font-semibold rounded"
        >
          Submit Teams
        </button>
      </div>
    </div>
  );
}
