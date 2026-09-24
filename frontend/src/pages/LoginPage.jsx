import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../api/client';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSubmitting(true);

    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setFieldErrors(err.fieldErrors);
      } else {
        setError('Something went wrong.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
  <div className="auth-page">
    <div className="auth-card">
      <div className="auth-header">
        <div className="auth-logo">IT</div>

        <h1>Welcome back</h1>
        <p>Log in to your Issue Tracker account</p>
      </div>

      {error && (
        <div className="error-banner" role="alert" aria-live="assertive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            autoComplete="username"
            required
          />

          {fieldErrors.username && (
            <div className="field-error">
              {fieldErrors.username[0]}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />

          {fieldErrors.password && (
            <div className="field-error">
              {fieldErrors.password[0]}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="auth-button"
          disabled={submitting}
        >
          {submitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="auth-footer">
        Don't have an account?{' '}
        <Link to="/register">Create account</Link>
      </p>
    </div>
  </div>
);
}