/*
  SongSearchBar Component
  -----------------------
  A presentation (stateless) component responsible for capturing user input.

  Design Pattern:
  This follows the controlled component pattern where the input value
  is controlled by the parent state (passed in via props), making the
  parent the single source of truth.
*/

import React from "react";

export default function SongSearchBar({ value, onChange, onSearch, error }) {
  return (
    <>
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6 bg-vivpro-mint p-4 rounded-lg border border-vivpro-teal/20">
        <input
          type="text"
          placeholder="Search by song title..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full sm:flex-1 px-4 py-2 border border-vivpro-light rounded-lg focus:outline-none focus:ring-2 focus:ring-vivpro-teal text-vivpro-navy bg-white"
        />

        <button
          type="button"
          onClick={onSearch}
          className="w-full sm:w-auto px-6 py-2 bg-vivpro-navy rounded-lg text-white text-sm font-medium hover:bg-opacity-90 transition shadow-sm"
        >
          Get Song
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-lg border border-red-100 text-sm">
          {error}
        </div>
      )}
    </>
  );
}

