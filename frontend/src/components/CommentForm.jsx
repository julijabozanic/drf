import { useState } from 'react';
import { apiFetch, ApiError } from '../api/client';

export default function CommentForm({ issueId, onAdded }) {
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const comment = await apiFetch(`/issues/${issueId}/comments/`, {
        method: 'POST',
        body: JSON.stringify({ body }),
      });
      onAdded(comment);
      setBody('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="error-banner" role="alert" aria-live="assertive">
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="comment-body">Add a comment</label>
        <textarea
          id="comment-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Posting...' : 'Post comment'}
      </button>
    </form>
  );
}