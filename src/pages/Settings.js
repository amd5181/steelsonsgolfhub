import React from 'react';

function Settings() {
  const tableStyle = {
    borderCollapse: 'collapse',
    width: '100%',
    maxWidth: '500px',
    marginBottom: '40px',
    color: 'white',
    fontSize: '16px'
  };

  const thStyle = {
    borderBottom: '2px solid #ccc',
    padding: '10px',
    textAlign: 'left',
    backgroundColor: '#222',
    color: '#ffd700'
  };

  const tdStyle = {
    borderBottom: '1px solid #444',
    padding: '8px'
  };

  return (
<div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto', color: 'white', position: 'relative', zIndex: 1 }}>
<h2 style={{ fontSize: '28px', marginBottom: '20px', borderBottom: '2px solid #ffd700', paddingBottom: '5px' }}>
        League Scoring System
      </h2>

      <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '25px' }}>
        The Steel Sons scoring format rewards both high finishes and steady performance. Teams earn points in two ways: based on a player’s final <strong>Place</strong> and how many <strong>Strokes Behind</strong> they finished from the tournament leader. This balanced approach ensures value from both stars and depth picks.
      </p>

      <h3 style={{ color: '#ffd700' }}>🏆 Place Points</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Place</th>
            <th style={thStyle}>Points</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style={tdStyle}>1st</td><td style={tdStyle}>300</td></tr>
          <tr><td style={tdStyle}>2nd</td><td style={tdStyle}>200</td></tr>
          <tr><td style={tdStyle}>3rd</td><td style={tdStyle}>150</td></tr>
          <tr><td style={tdStyle}>4th</td><td style={tdStyle}>125</td></tr>
          <tr><td style={tdStyle}>5th</td><td style={tdStyle}>100</td></tr>
          <tr><td style={tdStyle}>6th</td><td style={tdStyle}>80</td></tr>
          <tr><td style={tdStyle}>7th</td><td style={tdStyle}>75</td></tr>
          <tr><td style={tdStyle}>8th</td><td style={tdStyle}>70</td></tr>
          <tr><td style={tdStyle}>9th</td><td style={tdStyle}>65</td></tr>
          <tr><td style={tdStyle}>10th</td><td style={tdStyle}>60</td></tr>
          <tr><td style={tdStyle}>11th</td><td style={tdStyle}>55</td></tr>
          <tr><td style={tdStyle}>12th</td><td style={tdStyle}>54</td></tr>
          <tr><td style={tdStyle}>13th</td><td style={tdStyle}>53</td></tr>
          <tr><td style={tdStyle}>14th</td><td style={tdStyle}>52</td></tr>
          <tr><td style={tdStyle}>15th</td><td style={tdStyle}>51</td></tr>
          <tr><td style={tdStyle}>Each additional place behind</td><td style={tdStyle}>1 point less</td></tr>
          <tr><td style={tdStyle}>64th</td><td style={tdStyle}>2</td></tr>
          <tr><td style={tdStyle}>65th or lower</td><td style={tdStyle}>1</td></tr>
          <tr><td style={tdStyle}>CUT</td><td style={tdStyle}>0</td></tr>
        </tbody>
      </table>

      <h3 style={{ color: '#ffd700' }}>⛳ Stroke Points</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Finish vs. Leader</th>
            <th style={thStyle}>Points</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style={tdStyle}>Leader</td><td style={tdStyle}>100</td></tr>
          <tr><td style={tdStyle}>Regulation tie / extra holes</td><td style={tdStyle}>100</td></tr>
          <tr><td style={tdStyle}>1 stroke behind</td><td style={tdStyle}>85</td></tr>
          <tr><td style={tdStyle}>2 strokes behind</td><td style={tdStyle}>80</td></tr>
          <tr><td style={tdStyle}>3 strokes behind</td><td style={tdStyle}>75</td></tr>
          <tr><td style={tdStyle}>4 strokes behind</td><td style={tdStyle}>70</td></tr>
          <tr><td style={tdStyle}>5 strokes behind</td><td style={tdStyle}>65</td></tr>
          <tr><td style={tdStyle}>Each additional stroke behind</td><td style={tdStyle}>5 points less</td></tr>
          <tr><td style={tdStyle}>18 strokes behind</td><td style={tdStyle}>5</td></tr>
          <tr><td style={tdStyle}>19+ strokes behind</td><td style={tdStyle}>0</td></tr>
          <tr><td style={tdStyle}>CUT</td><td style={tdStyle}>0</td></tr>
        </tbody>
      </table>

      <p style={{ fontStyle: 'italic', marginTop: '20px' }}>
        In short, the best teams aren’t just built on stars — they’re built on balance, with contributors across the board. This system rewards skill, strategy, and strong all-around performance.
      </p>
    </div>
  );
}

export default Settings;
