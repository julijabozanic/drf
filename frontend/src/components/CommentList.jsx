export default function CommentList({ comments }) {
  if (comments.length === 0) {
    return <p className="meta">No comments yet.</p>;
  }

  return (
    <div>
      {comments.map((comment) => (
        <div key={comment.id} className="comment word-wrap">
          <p className="meta">
            {comment.author} · {new Date(comment.created_at).toLocaleDateString()}
          </p>
          <p>{comment.body}</p>
        </div>
      ))}
    </div>
  );
}