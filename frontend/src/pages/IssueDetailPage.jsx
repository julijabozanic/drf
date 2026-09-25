import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

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

const PRIORITY_OPTIONS = [
  'low',
  'medium',
  'high',
];

export default function IssueDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [statusUpdating, setStatusUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState('medium');
  const [saving, setSaving] = useState(false);

  // Assign
  const [users, setUsers] = useState([]);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    loadIssue();
  }, [id]);

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

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

  async function loadUsers() {
    try {
      const data = await apiFetch('/auth/users/');
      setUsers(data);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not load users.'
      );
    }
  }

  async function handleAssigneeChange(e) {
    const value = e.target.value;

    setAssigning(true);
    setError('');

    try {
      const data = await apiFetch(`/issues/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({
          assignee_id: value
            ? Number(value)
            : null,
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
      setAssigning(false);
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

  function startEditing() {
    setEditTitle(issue.title);
    setEditDescription(issue.description);
    setEditPriority(issue.priority);

    setError('');
    setIsEditing(true);
  }

  function cancelEditing() {
    setEditTitle('');
    setEditDescription('');
    setEditPriority('medium');

    setError('');
    setIsEditing(false);
  }

  async function handleUpdate(e) {
    e.preventDefault();

    setSaving(true);
    setError('');

    try {
      const data = await apiFetch(`/issues/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          priority: editPriority,
        }),
      });

      setIssue(data);
      setIsEditing(false);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Something went wrong.'
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      'Are you sure you want to delete this issue? This action cannot be undone.'
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setError('');

    try {
      await apiFetch(`/issues/${id}/`, {
        method: 'DELETE',
      });

      navigate('/');
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Something went wrong.'
      );

      setDeleting(false);
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

  const canEditIssue =
    isAdmin || issue.author_id === user?.id;

  const canChangeStatus =
    isAdmin || issue.assignee?.id === user?.id;

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
              Reported by {issue.author}
              {' · '}
              {formatDate(issue.created_at)}
            </p>
          </div>

          <div className="issue-detail-actions">
            {canEditIssue && !isEditing && (
              <button
                type="button"
                className="edit-issue-button"
                onClick={startEditing}
              >
                Edit issue
              </button>
            )}

            <span
              className={`priority-badge priority-${issue.priority}`}
            >
              {formatPriority(issue.priority)}
            </span>
          </div>
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

          {/* Status */}
          <div className="issue-info-item">
            <span className="info-label">
              Status
            </span>

            {canChangeStatus ? (
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

          {/* Priority */}
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

          {/* Assignee */}
          <div className="issue-info-item">
            <span className="info-label">
              Assigned to
            </span>

            {isAdmin ? (
              <select
                value={issue.assignee?.id ?? ''}
                onChange={handleAssigneeChange}
                disabled={assigning}
              >
                <option value="">
                  Unassigned
                </option>

                {users.map((assignableUser) => (
                  <option
                    key={assignableUser.id}
                    value={assignableUser.id}
                  >
                    {assignableUser.username}
                  </option>
                ))}
              </select>
            ) : (
              <span className="assignee-name">
                {issue.assignee?.username ?? 'Unassigned'}
              </span>
            )}
          </div>
        </div>

        {/* Edit form / Description */}
        {isEditing ? (
          <section className="issue-edit-section">
            <h2>Edit issue</h2>

            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label htmlFor="edit-title">
                  Title
                </label>

                <input
                  id="edit-title"
                  type="text"
                  value={editTitle}
                  onChange={(e) =>
                    setEditTitle(e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-description">
                  Description
                </label>

                <textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) =>
                    setEditDescription(e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-priority">
                  Priority
                </label>

                <select
                  id="edit-priority"
                  value={editPriority}
                  onChange={(e) =>
                    setEditPriority(e.target.value)
                  }
                >
                  {PRIORITY_OPTIONS.map((priority) => (
                    <option
                      key={priority}
                      value={priority}
                    >
                      {formatPriority(priority)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="edit-actions">
                <button
                  type="submit"
                  className="save-issue-button"
                  disabled={saving}
                >
                  {saving
                    ? 'Saving...'
                    : 'Save changes'}
                </button>

                <button
                  type="button"
                  className="cancel-edit-button"
                  onClick={cancelEditing}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        ) : (
          <section className="issue-description">
            <h2>Description</h2>

            <p className="word-wrap">
              {issue.description}
            </p>
          </section>
        )}

        {/* Comments */}
        {!isEditing && (
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
        )}

        {/* Admin-only delete */}
        {isAdmin && !isEditing && (
          <section className="admin-actions">
            <div>
              <h2>Danger zone</h2>

              <p>
                Deleting an issue is permanent and cannot be undone.
              </p>
            </div>

            <button
              type="button"
              className="delete-issue-button"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting
                ? 'Deleting...'
                : 'Delete issue'}
            </button>
          </section>
        )}
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
    priority.charAt(0).toUpperCase()
    + priority.slice(1)
  );
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString();
}