/*
  SongSectionHeader Component
  ---------------------------
  A "Presentation" (Stateless) component that acts as the control panel for the data section.
  
  Responsibilities:
  1. Feedback: Displays the count of records currently visible vs. total records.
  2. Actions: Hosts primary actions like 'Reset View' and 'Download CSV'.
  3. Layout: Handles the responsive positioning of the title and buttons.
*/

import React from "react";

export default function SongSectionHeader({
    songsLength,
    total,
    onDownload,
}) {
    return (

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">

            {/* Title & Metadata Section */}
            <div>
                <h2 className="text-xl font-bold text-vivpro-navy">Song Data</h2>

                <p className="text-sm text-vivpro-gray mt-1">
                    Showing {songsLength} result(s) from {total} total records.
                </p>
            </div>

            <div className="flex gap-2">

                <button
                    type="button"
                    onClick={onDownload}
                    className="px-4 py-2 bg-vivpro-teal rounded-lg text-sm font-medium hover:bg-opacity-90 transition shadow-sm"
                >
                    Download CSV
                </button>
            </div>
        </div>
    );
}