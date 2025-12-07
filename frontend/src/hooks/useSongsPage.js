/*
  useSongsPage Custom Hook
  ------------------------
  This hook acts as the "Controller" for the Songs Dashboard.
  
  Pattern: Container/Presenter Pattern (Separation of Concerns).
  - This file contains all the "Business Logic" (State, API calls, Error handling).
  - The UI components (Dashboard.js) allow this logic to drive the view without knowing 
    how the data is fetched.
*/

import { useEffect, useState, useRef } from "react";
import { getAllSongs } from "../api/getAllSongs";
import { getSongsPage } from "../api/getSongsPage";
import { getSongByTitle } from "../api/getSongByTitle";
import { downloadCSV } from "../utils/downloadCSV";

const PAGE_SIZE = 10;
export function useSongsPage() {

    // Data State: Holds the current list of songs displayed in the table
    const [songs, setSongs] = useState([]);

    // Pagination State
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // Sorting State
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'

    // Search State
    const [searchTitle, setSearchTitle] = useState("");
    const [searchError, setSearchError] = useState("");

    // Full Dataset State: Used for Client-Side features like Charts and CSV Export
    const [allSongs, setAllSongs] = useState([]);

    const hasMountedRef = useRef(false);
    /*
      loadPage
      --------
      Fetches a specific page of data from the backend.
      This is responsible for keeping the Table UI in sync with the Pagination UI.
    */
    async function loadPage(pageNumber = 1) {
        try {
            const data = await getSongsPage(pageNumber, PAGE_SIZE);

            setSongs(data.songs || []);
            setPage(data.page || 1);
            setTotal(data.total ?? 0);
            setTotalPages(data.total_pages ?? 1);
            setSearchError("");
        } catch (err) {
            console.error("Failed to load songs page", err);
            setSongs([]);
            setPage(1);
            setTotal(0);
            setTotalPages(1);
            setSearchError("Failed to load songs.");
        }
    }

    /*
      fetchAllSongs
      -------------
      Fetches the entire dataset for operations that require global context,
      such as generating summary charts or downloading the full CSV.
    */
    async function fetchAllSongs() {
        try {
            const data = await getAllSongs();
            setAllSongs(data || []);
        } catch (err) {
            console.error("Failed to load all songs", err);
            setAllSongs([]);
        }
    }

    /*
      Effect: Pagination Trigger
      When the 'page' state changes (e.g., user clicks Next), this effect fires
      to fetch the new data.
    */
    useEffect(() => {
        loadPage(page);
    }, [page]);

    /*
      Effect: Initialization
      Runs once on component mount to fetch the background dataset needed for charts.
    */
    useEffect(() => {
        fetchAllSongs();
    }, []);

    useEffect(() => {
        if (!hasMountedRef.current) {
          hasMountedRef.current = true;
          return;
        }
    
        if (!searchTitle.trim()) {
          setSearchError("");
          loadPage(1); // reload first page from backend
        }
      }, [searchTitle]);
    

    /*
      handleSort
      ----------
      Implements toggle logic: 
      - Click same field -> Toggle ASC/DESC.
      - Click new field -> Reset to ASC.
    */
    function handleSort(field) {
        if (sortField === field) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    }

    /*
      handleSearch
      ------------
      Performs an exact title search against the backend.
      Note: This overrides the current pagination view with the search result.
    */
    async function handleSearch() {
        const trimmed = searchTitle.trim();

        // Validation: Prevent empty searches
        if (!trimmed) {
            setSearchError("Please enter a title.");
            return;
        }

        try {
            const res = await getSongByTitle(trimmed);

            if (!res.ok) {
                setSearchError("Song not found.");
                setSongs([]);
                setTotal(0);
                setTotalPages(1);
                return;
            }

            const data = await res.json();

            setSongs([data]);
            setTotal(1);
            setTotalPages(1);
            setPage(1);
            setSearchError("");
        } catch (err) {
            console.error("Failed to fetch song", err);
            setSearchError("Failed to fetch song.");
        }
    }


    /*
      handleDownloadAllSongs
      ----------------------
      Generates a CSV file for the user.
      Optimization: Checks if 'allSongs' is already loaded to avoid redundant network requests.
    */
    async function handleDownloadAllSongs() {
        try {
            let data = allSongs;

            if (!data || data.length === 0) {
                data = await getAllSongs();
                setAllSongs(data || []);
            }

            if (data && data.length > 0) {
                downloadCSV(data, "all");
            }
        } catch (err) {
            console.error("Failed to download all songs", err);
        }
    }

    return {
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
    };
}