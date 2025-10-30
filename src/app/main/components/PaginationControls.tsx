interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onFirst: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLast: () => void;
  hasResults: boolean;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  onFirst,
  onPrev,
  onNext,
  onLast,
  hasResults,
}: PaginationControlsProps) {
  if (!hasResults) {
    return null;
  }

  return (
    <div className="flex justify-center items-center gap-4 mb-6">
      <button
        onClick={onFirst}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded bg-red-500 text-white disabled:bg-red-300"
        aria-label="First page"
      >
        « First
      </button>
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded bg-red-500 text-white disabled:bg-red-300"
        aria-label="Previous page"
      >
        ‹ Prev
      </button>
      <span className="font-semibold">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded bg-red-500 text-white disabled:bg-red-300"
        aria-label="Next page"
      >
        Next ›
      </button>
      <button
        onClick={onLast}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded bg-red-500 text-white disabled:bg-red-300"
        aria-label="Last page"
      >
        Last »
      </button>
    </div>
  );
}
