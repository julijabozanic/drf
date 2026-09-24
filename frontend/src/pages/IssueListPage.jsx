import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch, ApiError } from '../api/client';
import IssueCard from '../components/IssueCard';
import Pagination from '../components/Pagination';

export default function IssueListPage() {
  const [issues, setIssues] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadIssues(page);
  }, [page]);

  async function loadIssues(pageNumber) {
    setLoading(true);
    setError('');

    try {
      const data = await apiFetch(`/issues/?page=${pageNumber}`);

      setIssues(data.results);
      setMeta({
        count: data.count,
        next: data.next,
        previous: data.previous,
      });
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

  return (
    <div className="issues-page">
      <div className="container">

        <section className="issues-hero">
          <div className="issues-hero-content">
            <span className="eyebrow">ISSUE TRACKER</span>

            <h1>Manage your issues</h1>

            <p>
              Keep track of bugs, tasks and reported problems
              in one place.
            </p>
          </div>

          <Link to="/issues/new" className="new-issue-button">
            <span className="plus-icon">+</span>
            New issue
          </Link>
        </section>

        <section className="issues-stats">
          <div className="stat-card">
            <div className="stat-icon">◎</div>

            <div>
              <span className="stat-label">Total issues</span>
              <strong>{meta?.count ?? '—'}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">◫</div>

            <div>
              <span className="stat-label">Current page</span>
              <strong>{issues.length}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⚡</div>

            <div>
              <span className="stat-label">High priority</span>
              <strong>
                {
                  issues.filter(
                    (issue) => issue.priority === 'high'
                  ).length
                }
              </strong>
            </div>
          </div>
        </section>

        {error && (
          <div
            className="error-banner"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        <section className="issues-section">
          <div className="issues-section-header">
            <div>
              <h2>Recent issues</h2>
              <p>View and manage reported issues.</p>
            </div>

            {!loading && issues.length > 0 && (
              <span className="issue-count">
                {issues.length} on this page
              </span>
            )}
          </div>

          {loading ? (
            <div className="issues-empty">
              <div className="loading-circle" />
              <p>Loading issues...</p>
            </div>
          ) : issues.length === 0 ? (
            <div className="issues-empty">
              <div className="empty-icon">✓</div>

              <h3>No issues yet</h3>

              <p>
                Everything looks clear. Create a new issue
                when something comes up.
              </p>

              <Link to="/issues/new" className="empty-button">
                Create first issue
              </Link>
            </div>
          ) : (
            <div className="issues-list">
              {issues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                />
              ))}
            </div>
          )}

          <Pagination
            meta={meta}
            onPrevious={() => setPage((p) => p - 1)}
            onNext={() => setPage((p) => p + 1)}
          />
        </section>

      </div>
    </div>
  );
}