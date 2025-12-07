/*
  SummaryPanel
  ------------
  A small overview card that summarizes the dataset currently loaded
  on the client.

  Responsibilities:
  - Show how many rows are available.
  - List the attribute names present on each song.
*/

import React, { useMemo } from "react";

export default function SummaryPanel({ allSongs }) {
    // Total rows is simply the length of the array, or 0 if not loaded yet.
    const totalRows = allSongs?.length ?? 0;

    // Derive attribute names from the first song.
    // useMemo avoids recomputing on every render unless allSongs changes.
    const attributes = useMemo(() => {
        if (!allSongs || allSongs.length === 0) {
            return [];
        }
        return Object.keys(allSongs[0]);
    }, [allSongs]);

    const isEmpty = totalRows === 0;

    return (
        <div className="bg-vivpro-card rounded-xl border border-vivpro-light p-6 shadow-sm">
            <h2 className="text-lg font-bold text-vivpro-navy mb-2">
                Dataset Summary
            </h2>

            <p className="text-sm text-vivpro-gray">
                Audio feature dataset of normalized songs from a static playlist.
            </p>

            <div className="mt-4 text-sm text-vivpro-gray">
                <p className="mb-1">
                    <span className="font-semibold">Total rows:</span>{" "}
                    {isEmpty ? "Loading..." : totalRows}
                </p>

                <p className="font-semibold mb-1">Attributes:</p>

                {isEmpty ? (
                    <p className="text-xs text-vivpro-gray">
                        Waiting for dataset to load.
                    </p>
                ) : (
                    <ul className="list-disc pl-5 text-sm leading-relaxed">
                        {attributes.map((attr) => (
                            <li key={attr}>{attr}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
