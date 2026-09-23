import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    setOpen(false);
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Issue Tracker</Link>

      <button
        className="navbar-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Toggle navigation"
      >
        ☰
      </button>

      <div className={`navbar-links${open ? ' open' : ''}`}>
        {isAuthenticated ? (
          <>
            <span className="meta">{user.username}</span>
            <Link to="/" onClick={() => setOpen(false)}>Issues</Link>
            <button className="secondary" onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setOpen(false)}>Log in</Link>
            <Link to="/register" onClick={() => setOpen(false)}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}