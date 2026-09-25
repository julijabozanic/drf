import { Link } from 'react-router-dom';

export default function IssueCard({ issue }) {
  return (
    <Link
      to={`/issues/${issue.id}`}
      className="issue-card-link"
    >
      <article className="issue-card">
        <div
          className={`priority-indicator priority-indicator-${issue.priority}`}
        />

        <div className="issue-card-content">
          <div className="issue-card-top">
            <div className="issue-card-main">
              <h3 className="word-wrap">
                {issue.title}
              </h3>

              <div className="issue-meta">
                <span>
                  Reported by {issue.author}
                </span>

                <span className="meta-dot">
                  •
                </span>

                <span>
                  {formatDate(issue.created_at)}
                </span>
              </div>
            </div>

            <span
              className={`priority-badge priority-${issue.priority}`}
            >
              {formatPriority(issue.priority)}
            </span>
          </div>

          <div className="issue-card-bottom">
            <div className="issue-badges">
              <span
                className={`status-badge status-${issue.status}`}
              >
                <span className="badge-dot" />

                {formatStatus(issue.status)}
              </span>
            </div>

            <div className="issue-assignee">
              <span className="issue-assignee-label">
                Assigned to
              </span>

              <span className="issue-assignee-name">
                {issue.assignee?.username ?? 'Unassigned'}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
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