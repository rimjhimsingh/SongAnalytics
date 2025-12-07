/*
  Dashboard Component
  -------------------
  This component acts as the "Page Controller" for the main view.
  It is responsible for:
  1. Fetching data (via the useSongsPage hook).
  2. Managing page-specific state (search, sort, pagination).
  3. Composing the UI sections (Summary, Table, Charts).
*/
import React from "react";

import SongsTable from "./SongsTable";
import Pagination from "./Pagination";
import SongSearchBar from "./SongSearchBar";
import SongSectionHeader from "./SongSectionHeader";
import SummaryPanel from "./SummaryPanel";

// Hooks located one level up
import { useSongsPage } from "../hooks/useSongsPage";

const Dashboard = () => {
    // Extract state and handlers from our custom hook
    // This keeps the UI component clean and focused on rendering
    const {
        songs,
        page,
        total,
        totalPages,
        sortField,
        sortOrder,
        searchTitle,
        searchError,
        allSongs,
        setPage,
        setSearchTitle,
        handleSort,
        handleSearch,
        handleDownloadAllSongs,
    } = useSongsPage();



    return (
        <div className="grid grid-cols-12 gap-6 mt-6">
            {/* Left Column: Summary Panel */}
            <aside className="col-span-12 lg:col-span-4 space-y-4">
                <SummaryPanel allSongs={allSongs} />
            </aside>

            {/* Right Column: Main Data Table */}
            <section className="col-span-12 lg:col-span-8 space-y-4">
                <div className="bg-vivpro-card rounded-xl border border-vivpro-light shadow-sm p-6">

                    {/* Header Actions (Reset & Download) */}
                    <SongSectionHeader
                        songsLength={songs.length}
                        total={total}
                        onDownload={handleDownloadAllSongs}
                    />

                    {/* Search Input */}
                    <SongSearchBar
                        value={searchTitle}
                        onChange={setSearchTitle}
                        onSearch={handleSearch}
                        error={searchError}
                    />

                    {/* Data Grid */}
                    <SongsTable
                        songs={songs}
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                    />

                    {/* Pagination Section
                        ------------------
                        We isolate the pagination controls in a distinct container with a top border.
                        This creates clear visual separation from the data table above it.
                    */}
                    <div className="mt-6 border-t border-vivpro-light pt-4">
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onNext={() => setPage((p) => p + 1)}
                            onPrev={() => setPage((p) => Math.max(1, p - 1))}
                        />
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Dashboard;