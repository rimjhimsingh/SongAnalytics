/*
  SongsTable Component
  --------------------
  A reusable data grid component that handles sorting and data visualization.
  
  Best Practices Applied:
  1. Memoization: Sorting is expensive; we use useMemo to prevent lag on re-renders.
  2. Stable Keys: Uses unique IDs instead of array indices for React reconciliation.
  3. Constant Extraction: Static configuration (columns) is defined outside the render loop.
*/

import React, { useMemo } from "react";
const COLUMNS = [
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "danceability", label: "Danceability" },
    { key: "energy", label: "Energy" },
    { key: "key", label: "Key" },
    { key: "loudness", label: "Loudness" },
    { key: "mode", label: "Mode" },
    { key: "acousticness", label: "Acousticness" },
    { key: "instrumentalness", label: "Instrumentalness" },
    { key: "liveness", label: "Liveness" },
    { key: "valence", label: "Valence" },
    { key: "tempo", label: "Tempo" },
    { key: "duration_ms", label: "Duration (ms)" },
    { key: "time_signature", label: "Time sig" },
    { key: "num_bars", label: "Bars" },
    { key: "num_sections", label: "Sections" },
    { key: "num_segments", label: "Segments" },
    { key: "class", label: "Class" },
];

function SongsTable({ songs, sortField, sortOrder, onSort }) {

    // MEMOIZATION:
    // Only re-run this sorting logic if the dependencies (songs, sortField, sortOrder) change.
    // This prevents the table from freezing the UI during unrelated updates.
    const sortedSongs = useMemo(() => {
        // Always copy before sorting to avoid mutating the original prop
        const data = [...songs];

        if (!sortField) return data;

        return data.sort((a, b) => {
            const valA = a[sortField];
            const valB = b[sortField];

            if (typeof valA === "string") {
                return sortOrder === "asc"
                    ? valA.localeCompare(valB)
                    : valB.localeCompare(valA);
            }

            return sortOrder === "asc" ? valA - valB : valB - valA;
        });
    }, [songs, sortField, sortOrder]);

    // Helper for visual arrow indicator
    function getArrow(field) {
        if (sortField !== field) return null;
        return sortOrder === "asc" ? " ↑" : " ↓";
    }

    // Helper for specific cell formatting
    function renderCell(colKey, song) {
        switch (colKey) {
            case "id":
                return (
                    <span className="text-vivpro-navy font-medium truncate max-w-[120px] inline-block" title={song.id}>
                        {song.id}
                    </span>
                );
            case "title":
                return <span className="font-medium">{song.title}</span>;
            case "tempo":
                return Math.round(song.tempo);
            default:
                return song[colKey];
        }
    }

    // Styles (Tailwind)
    const headerStyle = "px-4 py-3 text-left font-bold text-vivpro-navy cursor-pointer hover:text-vivpro-teal transition-colors select-none whitespace-nowrap";
    const cellStyle = "px-4 py-3 text-sm text-vivpro-gray whitespace-nowrap";

    return (
        <div className="overflow-x-auto border border-vivpro-light rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-vivpro-light">
                <thead className="bg-vivpro-mint">
                    <tr>
                        {COLUMNS.map((col) => (
                            <th
                                key={col.key}
                                className={headerStyle}
                                onClick={() => onSort(col.key)}
                                // Accessibility: Tell screen readers this column is sortable
                                aria-sort={sortField === col.key ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
                                scope="col"
                            >
                                {col.label} {getArrow(col.key)}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="divide-y divide-vivpro-light bg-white">
                    {sortedSongs.length > 0 ? (
                        sortedSongs.map((song) => (

                            <tr key={song.id}
                                className="hover:bg-vivpro-mint/30 transition-colors" >
                                {COLUMNS.map((col) => (
                                    <td key={`${song.id}-${col.key}`} className={cellStyle}>
                                        {renderCell(col.key, song)}
                                    </td>
                                ))}
                            </tr>
                        ))) : (<tr>
                            <td
                                colSpan={COLUMNS.length}
                                className="px-4 py-8 text-center text-vivpro-gray"
                            >
                                No songs found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default SongsTable;