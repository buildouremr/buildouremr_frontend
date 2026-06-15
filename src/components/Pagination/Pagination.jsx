import { MdChevronLeft, MdChevronRight } from "react-icons/md";

/**
 * Build the page-number items to render.
 * Always shows: first 4 pages, ellipsis if needed, last page.
 * The "window" of 4 pages shifts as current page moves past 4.
 *
 * Examples (total=100):
 *   current=1  → [1, 2, 3, 4, ..., 100]
 *   current=4  → [1, 2, 3, 4, ..., 100]
 *   current=5  → [1, ..., 3, 4, 5, 6, ..., 100]
 *   current=98 → [1, ..., 97, 98, 99, 100]
 *   current=100→ [1, ..., 97, 98, 99, 100]
 */
const buildPageItems = (current, total) => {
  if (total <= 1) return [1];
  if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);

  const items = [];

  // Always show page 1
  items.push(1);

  // Window of 4 pages centred around current (but min starts at 2)
  const winSize = 4;
  let winStart = Math.max(2, current - 1);
  let winEnd = winStart + winSize - 1;

  // Don't let window go past (total - 1) since last page is always shown separately
  if (winEnd >= total) {
    winEnd = total - 1;
    winStart = Math.max(2, winEnd - winSize + 1);
  }

  // Left ellipsis
  if (winStart > 2) items.push("...");

  for (let p = winStart; p <= winEnd; p++) items.push(p);

  // Right ellipsis
  if (winEnd < total - 1) items.push("...");

  // Always show last page
  items.push(total);

  return items;
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const safeTotal = Math.max(totalPages || 1, 1);

  // Always render — parent decides whether to mount this component.
  // When there is only 1 page we still show "Page 1" with disabled prev/next.
  const items = buildPageItems(currentPage, safeTotal);

  return (
    <>
      <div className="shared-pagination">
        <button
          className="shared-pg-text-btn"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <MdChevronLeft style={{ fontSize: "1.2rem", marginRight: "4px" }} />
          Previous
        </button>

        <div className="shared-pg-numbers">
          {items.map((item, idx) =>
            item === "..." ? (
              <span key={`ellipsis-${idx}`} className="shared-pg-ellipsis">
                …
              </span>
            ) : (
              <button
                key={item}
                className={`shared-pg-num ${currentPage === item ? "shared-pg-active" : ""}`}
                onClick={() => onPageChange(item)}
              >
                {item}
              </button>
            )
          )}
        </div>

        <button
          className="shared-pg-text-btn"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= safeTotal}
        >
          Next <MdChevronRight style={{ fontSize: "1.2rem", marginLeft: "4px" }} />
        </button>
      </div>

      <style>{`
        .shared-pagination {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 20px;
          padding: 14px 22px;
          border-top: 1px solid #eef0f5;
        }
        .shared-pg-text-btn {
          display: flex;
          align-items: center;
          background: none;
          border: none;
          color: #6b7280;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: color 0.2s;
          white-space: nowrap;
        }
        .shared-pg-text-btn:hover:not(:disabled) {
          color: #1a1a2e;
        }
        .shared-pg-text-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .shared-pg-numbers {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .shared-pg-num {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: transparent;
          color: #6b7280;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.2s;
        }
        .shared-pg-num:hover {
          background: #f0f2f5;
          color: #1a1a2e;
        }
        .shared-pg-active {
          background: #2E7DF7 !important;
          color: #fff !important;
          font-weight: 600;
        }
        .shared-pg-ellipsis {
          width: 28px;
          text-align: center;
          color: #9ca3af;
          font-size: 0.9rem;
          line-height: 32px;
          user-select: none;
        }
      `}</style>
    </>
  );
};

export default Pagination;
