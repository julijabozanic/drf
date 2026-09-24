import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { apiFetch, ApiError } from '../api/client';

import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';

const STATUS_OPTIONS = [
  'open',
  'in_progress',
  'resolved',
  'closed',
];

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
      setError(
        err instanceof ApiError
          ? err.message
          : 'Something went wrong.'
      );
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
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      setIssue(data);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Something went wrong.'
      );
    } finally {
      setStatusUpdating(false);
    }
  }

  function handleCommentAdded(comment) {
    setIssue((prev) => ({
      ...prev,
      comments: [...(prev.comments ?? []), comment],
    }));
  }

  if (loading) {
    return (
      <div className="container app-container">
        <div className="page-panel">
          <p className="meta">Loading issue...</p>
        </div>
      </div>
    );
  }

  if (error && !issue) {
    return (
      <div className="container app-container">
        <Link to="/" className="back-link">
          ← Back to issues
        </Link>

        <div
          className="error-banner"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </div>
      </div>
    );
  }

  if (!issue) {
    return null;
  }

  return (
    <div className="container app-container">
      <Link to="/" className="back-link">
        ← Back to issues
      </Link>

      <div className="page-panel issue-detail">

        {/* Header */}
        <div className="issue-detail-header">
          <div className="issue-detail-title">
            <h1 className="word-wrap">
              {issue.title}
            </h1>

            <p className="meta">
              {issue.author}
              {' · '}
              {formatDate(issue.created_at)}
            </p>
          </div>

          <span
            className={`priority-badge priority-${issue.priority}`}
          >
            {formatPriority(issue.priority)}
          </span>
        </div>

        {/* Error */}
        {error && (
          <div
            className="error-banner"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        {/* Issue information */}
        <div className="issue-info">
          <div className="issue-info-item">
            <span className="info-label">
              Status
            </span>

            {isAdmin ? (
              <select
                id="status"
                value={issue.status}
                onChange={handleStatusChange}
                disabled={statusUpdating}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {formatStatus(status)}
                  </option>
                ))}
              </select>
            ) : (
              <span
                className={`status-badge status-${issue.status}`}
              >
                <span className="badge-dot" />

                {formatStatus(issue.status)}
              </span>
            )}
          </div>

          <div className="issue-info-item">
            <span className="info-label">
              Priority
            </span>

            <span
              className={`priority-badge priority-${issue.priority}`}
            >
              {formatPriority(issue.priority)}
            </span>
          </div>
        </div>

        {/* Description */}
        <section className="issue-description">
          <h2>Description</h2>

          <p className="word-wrap">
            {issue.description}
          </p>
        </section>

        {/* Comments */}
        <section className="comments-section">
          <div className="comments-header">
            <h2>
              Comments ({issue.comments?.length ?? 0})
            </h2>
          </div>

          <CommentList
            comments={issue.comments ?? []}
          />

          <div className="comment-form-wrapper">
            <CommentForm
              issueId={issue.id}
              onAdded={handleCommentAdded}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function formatStatus(status) {
  return status
    .replace('_', ' ')
    .replace(/^\w/, (c) => c.toUpperCase());
}

function formatPriority(priority) {
  return (
    priority.charAt(0).toUpperCase() +
    priority.slice(1)
  );
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString();
}