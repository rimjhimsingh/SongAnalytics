/*
  Pagination Component
  --------------------
  A "Presentation" (Stateless) component responsible solely for rendering navigation controls.
  
  Design Pattern:
  It follows the "Controlled Component" pattern, relying entirely on props from the parent 
  to determine the current page and total pages. It does not hold its own state.
*/

import React from "react";

function Pagination({ page, totalPages, onNext, onPrev }) {

    // Defensive Coding:
    // We normalize 'totalPages' to ensure it is always a valid number and at least 1.
    // This prevents the UI from displaying "Page 1 of NaN" or "Page 1 of 0" if the API fails.
    const safeTotalPages = Math.max(Number(totalPages) || 1, 1);
    const isFirstPage = page <= 1;
    const isLastPage = page >= safeTotalPages;

    // Event Handlers:
    // These wrappers provide an extra safety check. Even if the 'disabled' attribute 
    // is tampered with in the DOM, the function will not fire if the condition isn't met.
    const handlePrev = () => {
        if (!isFirstPage) {
            onPrev();
        }
    };

    const handleNext = () => {
        if (!isLastPage) {
            onNext();
        }
    };

    return (
        <nav
            className="flex items-center justify-between sm:justify-center gap-4 mt-2"
            aria-label="Pagination"
        >
            <button
                type="button" 
                onClick={handlePrev}
                disabled={isFirstPage}
                className="px-4 py-2 bg-vivpro-bg border border-vivpro-light text-vivpro-navy rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-vivpro-light transition-colors text-sm font-medium shadow-sm"
            >
                Previous
            </button>

            <span className="text-sm font-semibold text-vivpro-navy">
                Page <span className="text-vivpro-teal">{page}</span> of {safeTotalPages}
            </span>

            <button
                type="button"
                onClick={handleNext}
                disabled={isLastPage}
                className="px-4 py-2 bg-vivpro-bg border border-vivpro-light text-vivpro-navy rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-vivpro-light transition-colors text-sm font-medium shadow-sm"
            >
                Next
            </button>
        </nav>
    );
}

export default Pagination;