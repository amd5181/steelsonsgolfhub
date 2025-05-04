import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import MyTeams from './pages/MyTeams';
import Leaderboards from './pages/Leaderboards';
import LeagueHistory from './pages/LeagueHistory';
import Settings from './pages/Settings';

// ✅ Import the watermark image from src/assets/
import watermark from './assets/watermark.png';

function App() {
  const [showNav, setShowNav] = useState(true);
  const prevScrollPos = useRef(window.scrollY);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isMobile = window.innerWidth < 1024;

      if (isMobile) {
        const goingUp = prevScrollPos.current > currentScrollPos;
        const nearTop = currentScrollPos < 10;
        setShowNav(goingUp || nearTop);
      } else {
        setShowNav(true); // Always show nav on desktop
      }

      prevScrollPos.current = currentScrollPos;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const backgroundStyle = {
    backgroundImage: `url(${watermark})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
    backgroundAttachment: 'fixed',
    backgroundSize: 'cover',
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: -2
  };

  const overlayStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: -1
  };

  return (
    <>
      <div style={backgroundStyle}></div>
      <div style={overlayStyle}></div>

      <nav className={`emoji-nav ${showNav ? 'show' : 'hide'}`}>
        <Link to="/">
          <div className="emoji-link">
            🏠
            <span className="nav-label">Home</span>
          </div>
        </Link>
        <Link to="/my-teams">
          <div className="emoji-link">
            👥
            <span className="nav-label">My Teams</span>
          </div>
        </Link>
        <Link to="/leaderboards">
          <div className="emoji-link">
            📊
            <span className="nav-label">Leaderboards</span>
          </div>
        </Link>
        <Link to="/league-history">
          <div className="emoji-link">
            🏆
            <span className="nav-label">History</span>
          </div>
        </Link>
        <Link to="/settings">
          <div className="emoji-link">
            ⚙️
            <span className="nav-label">Settings</span>
          </div>
        </Link>
      </nav>

      <div style={{ paddingTop: '60px', position: 'relative', zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-teams" element={<MyTeams />} />
          <Route path="/leaderboards" element={<Leaderboards />} />
          <Route path="/league-history" element={<LeagueHistory />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
