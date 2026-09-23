import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch, ApiError } from '../api/client';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';

const STATUS_OPTIONS = ['open', 'in_progress', 'resolved', 'closed'];

export default function IssueDetailPage() {
  const { id } = useParams();
  const { isAdmin } = useAuth();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    loadIssue();
  }, [id]);

  async function loadIssue() {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch(`/issues/${id}/`);
      setIssue(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(e) {
    const newStatus = e.target.value;
    setStatusUpdating(true);
    setError('');
    try {
      const data = await apiFetch(`/issues/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      setIssue(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.');
    } finally {
      setStatusUpdating(false);
    }
  }

  function handleCommentAdded(comment) {
    setIssue((prev) => ({ ...prev, comments: [...prev.comments, comment] }));
  }

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (error && !issue) {
    return (
      <div className="container">
        <div className="error-banner" role="alert" aria-live="assertive">
          {error}
        </div>
      </div>
    );
  }

  if (!issue) {
    return null;
  }

  return (
    <div className="container">
      <Link to="/">&larr; Back to issues</Link>

      <h1 className="word-wrap">{issue.title}</h1>
      <p className="meta">
        {issue.author} · {new Date(issue.created_at).toLocaleDateString()}
      </p>

      {error && (
        <div className="error-banner" role="alert" aria-live="assertive">
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="status">Status</label>
        {isAdmin ? (
          <select
            id="status"
            value={issue.status}
            onChange={handleStatusChange}
            disabled={statusUpdating}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.replace('_', ' ')}
              </option>
            ))}
          </select>
        ) : (
          <p>{issue.status.replace('_', ' ')}</p>
        )}
      </div>

      <p className="meta">Priority: {issue.priority}</p>

      <p className="word-wrap">{issue.description}</p>

      <h2>Comments ({issue.comments.length})</h2>
      <CommentList comments={issue.comments} />
      <CommentForm issueId={issue.id} onAdded={handleCommentAdded} />
    </div>
  );
}