import { Link } from 'react-router-dom';

export default function IssueCard({ issue }) {
  return (
    <Link to={`/issues/${issue.id}`} className="card-link">
      <div className="card word-wrap">
        <h3>{issue.title}</h3>
        <p className="meta">Status: {formatStatus(issue.status)}</p>
        <p className="meta">Priority: {formatPriority(issue.priority)}</p>
        <p className="meta">
          {issue.author} · {formatDate(issue.created_at)}
        </p>
      </div>
    </Link>
  );
}

function formatStatus(status) {
  return status.replace('_', ' ').replace(/^\w/, (c) => c.toUpperCase());
}

function formatPriority(priority) {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString();
}