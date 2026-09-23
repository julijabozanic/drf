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
        setMeta({ count: data.count, next: data.next, previous: data.previous });
    } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Something went wrong.');
    } finally {
        setLoading(false);
    }
    }

  return (
    <div className="container">
      <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Issues</h1>
        <Link to="/issues/new">
          <button>New issue</button>
        </Link>
      </div>

      {error && (
        <div className="error-banner" role="alert" aria-live="assertive">
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : issues.length === 0 ? (
        <p className="meta">No issues yet.</p>
      ) : (
        issues.map((issue) => <IssueCard key={issue.id} issue={issue} />)
      )}

      <Pagination
        meta={meta}
        onPrevious={() => setPage((p) => p - 1)}
        onNext={() => setPage((p) => p + 1)}
      />
    </div>
  );
}