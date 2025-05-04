// src/pages/Home.js
import React from 'react';

function Home() {
  const tournaments = [
    {
      name: "Masters",
      startDate: "April 10, 2025",
      deadline: "April 10, 2025 – 10:00 AM ET",
      dateValue: new Date("2025-04-10T10:00:00")
    },
    {
      name: "PGA Championship",
      startDate: "May 15, 2025",
      deadline: "May 15, 2025 – 10:00 AM ET",
      dateValue: new Date("2025-05-15T10:00:00")
    },
    {
      name: "US Open",
      startDate: "June 12, 2025",
      deadline: "June 12, 2025 – 10:00 AM ET",
      dateValue: new Date("2025-06-12T10:00:00")
    },
    {
      name: "The Open",
      startDate: "July 17, 2025",
      deadline: "July 17, 2025 – 10:00 AM ET",
      dateValue: new Date("2025-07-17T10:00:00")
    }
  ];

  const now = new Date();

  return (
    <div
      style={{
        padding: "60px 20px",
        position: "relative",
        zIndex: 1,
        textAlign: "center", // ✅ Ensures header and paragraph are centered
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          color: "#FFD700",
          marginBottom: "20px",
        }}
      >
        Welcome to the Steel Sons Golf Hub
      </h1>
      <p
        style={{
          fontSize: "1.3rem",
          marginBottom: "50px",
          color: "#dddddd",
        }}
      >
        From Manor Valley to the Four Majors
      </p>

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {tournaments.map((t, i) => {
          const isPast = now > t.dateValue;
          return (
            <div
              key={i}
              style={{
                border: `1px solid ${isPast ? "#999" : "#FFD700"}`,
                borderRadius: "12px",
                padding: "25px",
                marginBottom: "30px",
                backgroundColor: "rgba(255, 255, 255, 0.03)",
                boxShadow: isPast
                  ? "0 0 4px rgba(255, 255, 255, 0.05)"
                  : "0 0 10px rgba(255, 215, 0, 0.2)",
                opacity: isPast ? 0.75 : 1,
                transition: "opacity 0.3s ease",
              }}
            >
              <h2
                style={{
                  color: isPast ? "#DDC86A" : "#FFD700",
                  marginBottom: "10px",
                }}
              >
                {t.name}
              </h2>
              <p>
                <strong style={{ color: "#ccc" }}>Start Date:</strong>{" "}
                {t.startDate}
              </p>
              <p>
                <strong style={{ color: "#ccc" }}>Entry Deadline:</strong>{" "}
                {t.deadline}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
