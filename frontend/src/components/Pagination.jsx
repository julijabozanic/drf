export default function Pagination({ meta, onPrevious, onNext }) {
  if (!meta || (!meta.next && !meta.previous)) {
    return null;
  }

  return (
    <div className="pagination">
      <button
        className="secondary"
        onClick={onPrevious}
        disabled={!meta.previous}
      >
        Previous
      </button>
      <span className="meta">{meta.count} total</span>
      <button
        className="secondary"
        onClick={onNext}
        disabled={!meta.next}
      >
        Next
      </button>
    </div>
  );
}