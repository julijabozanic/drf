import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiFetch, ApiError } from '../api/client';

const PRIORITY_OPTIONS = ['low', 'medium', 'high'];

export default function IssueCreatePage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSubmitting(true);

    try {
      const issue = await apiFetch('/issues/', {
        method: 'POST',
        body: JSON.stringify({ title, description, priority }),
      });
      navigate(`/issues/${issue.id}`);
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
    <div className="container app-container">
      <Link to="/" className="back-link">
        ← Back to issues
      </Link>

      <div className="page-panel">
        <div className="panel-header">
          <h1>New issue</h1>
          <p>Describe the problem and choose its priority.</p>
        </div>

        {error && (
          <div className="error-banner" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Short summary of the issue"
              required
            />

            {fieldErrors.title && (
              <div className="field-error">
                {fieldErrors.title[0]}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>

            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happened..."
              required
            />

            {fieldErrors.description && (
              <div className="field-error">
                {fieldErrors.description[0]}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>

            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <button
            className="primary-button"
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Creating...' : 'Create issue'}
          </button>
        </form>
      </div>
    </div>
  );
}