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

  function closeMenu() {
    setOpen(false);
  }

  return (
    <nav className="navbar">
      <Link
        to="/"
        className="navbar-brand"
        onClick={closeMenu}
      >
        <span className="navbar-logo">IT</span>
        <span>Issue Tracker</span>
      </Link>

      <button
        type="button"
        className="navbar-toggle"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={open ? 'Close navigation' : 'Open navigation'}
      >
        {open ? '×' : '☰'}
      </button>

      <div className={`navbar-links ${open ? 'open' : ''}`}>
        {isAuthenticated ? (
          <>
            <span className="navbar-user">
              {user.username}
            </span>

            <Link to="/" onClick={closeMenu}>
              Issues
            </Link>

            <Link to="/issues/new" onClick={closeMenu}>
              New issue
            </Link>

            <button
              type="button"
              className="navbar-logout"
              onClick={handleLogout}
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={closeMenu}>
              Log in
            </Link>

            <Link
              to="/register"
              className="navbar-register"
              onClick={closeMenu}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}