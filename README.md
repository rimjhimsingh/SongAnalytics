# Song Analytics Dashboard

A full stack application that normalizes, serves, and visualizes Spotify style song playlist data.  
The project is built with a **Python Flask** backend and a **React 18** frontend, with a focus on clean architecture and modular code.

---

## 🚀 Features

### Backend (Python Flask)

- **Data Normalization**  
  Converts the original column oriented JSON into a row oriented list of song objects that is easier to consume by APIs and UI tables.

- **In Memory Indexing and Caching**  
  At startup the service builds:

  - `normalized_data`: a list of song dictionaries kept in memory.
  - `title_index`: a dictionary that maps a normalized title to a song object.  
    This gives **O(1)** lookups by title instead of scanning the list on every request.

- **Robust Pagination**  
  Shared helper that:

  - Validates `page` and `size` inputs.
  - Clamps out of range pages to valid bounds.
  - Returns a structured response with `page`, `size`, `total`, `total_pages`, and `songs`.

- **Modular Architecture**  
  The backend is split into:

  - App factory and configuration.
  - Routes layer for HTTP concerns.
  - Services layer for business logic and pagination.
  - Normalization module for ETL style transformation.

- **Unit and Integration Tests**  
  Pytest based tests exercise the API endpoints and pagination behavior using Flask's test client.

### Frontend (React)

- **Modern Navigation and Code Splitting**

  - Uses **React Router v6 Data Router** with `createBrowserRouter` and `RouterProvider`.
  - `Dashboard` is lazy loaded with `React.lazy` and `Suspense` so the main bundle stays small.

- **Separation of Concerns with Custom Hook**

  - `useSongsPage` is the single place that talks to the backend and manages state.
  - UI components are pure presentational components that receive data and callbacks via props.

- **User Experience and Behavior**

  - Paginated table of songs with sortable columns.
  - Search by title using a dedicated backend endpoint.
  - When the search box is cleared, the view automatically returns to the normal paginated dataset.
  - Download all songs as CSV.
  - Dataset summary panel analysis.
  - Responsive layout styled with Tailwind CSS.

- **Performance Optimizations**
  - Client side sorting uses memoization to avoid recomputing on every render.
  - Pagination uses server side metadata (`total`, `total_pages`) so the client does not re derive counts.

---

## 🛠 Tech Stack

- **Backend**

  - Python 3
  - Flask
  - Pytest

- **Frontend**
  - React 18
  - React Router v6
  - Tailwind CSS v4 with `@tailwindcss/postcss`
  - Parcel bundler

---

## 🏗 Architecture and Design Decisions

### 1. Data Normalization Strategy

**Problem**  
The source dataset (`data/playlist.json`) is column oriented.  
Each top level key is an attribute name and its value is a mapping from row index to attribute value.

This shape is not convenient for typical APIs and UI tables, which expect each song as a flat object:

```json
{
  "id": "...",
  "title": "4 Walls",
  "danceability": 0.735,
  "energy": 0.849,
  "tempo": 119.98,
  "class": 1
}
```

**Solution**
`src/normalize.py` implements:

- `load_raw_json(path)`
  Opens the JSON file and returns the raw dictionary.

- `normalize(data)`

  - Inspects the attribute names (keys of the dictionary).
  - Uses the length of the first attribute to determine the row count.
  - Iterates over row indices and builds a list of dictionaries where each dictionary represents one song with all attributes filled.

This normalization runs at application startup, which trades a small one time cost for very fast request handling.

**Trade offs and scalability**

- For a 100 row dataset this approach is ideal. All queries become simple in memory operations.
- For very large datasets the normalization and indexing would move into a background ETL or a database, and the API would page directly from the database using indexes.

---

### 2. Search Optimization with Title Index

**Naive approach**
Loop through `normalized_data` on every `/songs/title` request and compare titles one by one
Time complexity would be O(N) per search.

**My approach**

On startup, the service builds `title_index`:

- Key: `title.casefold()` (case insensitive and Unicode aware)
- Value: the full song dictionary

Lookup flow in the `/songs/title` route:

1. Read the `title` query parameter.
2. Trim whitespace and validate that it is not empty.
3. Normalize using `casefold` and look it up in `title_index`.
4. Return the song if found, or a 404 JSON error otherwise.

This provides:

- **O(1)** average time for title lookups.
- Robustness against case differences and trailing spaces.

---

### 3. Pagination Design

Pagination is implemented in a reusable helper in the services layer:

- Validates `size`, falling back to a safe default when it is missing or invalid.
- Computes `total_items` and `total_pages`.
- Clamps `page` to the valid range `1..total_pages`.

  - If `page` is below 1 it becomes 1.
  - If it is beyond `total_pages` and there is at least one page, it becomes `total_pages`.

The response shape for `GET /songs` is:

```json
{
  "page": 1,
  "size": 10,
  "total": 100,
  "total_pages": 10,
  "songs": [
    /* array of up to 10 songs */
  ]
}
```

This structure lets the frontend simply render `page` and `total_pages` instead of guessing.

---

### 4. Frontend State Management and Hooks

The custom hook `useSongsPage` encapsulates all application state related to songs:

- **Pagination state**
  `songs`, `page`, `total`, `totalPages`

- **Sorting state**
  `sortField`, `sortOrder`

- **Search state**
  `searchTitle`, `searchError`

- **Analytics state**
  `allSongs` for CSV export

The hook exposes high level actions:

- `setPage(page)`
  Triggers a fetch of that page from the backend.

- `handleSearch()`
  Validates input and calls the `/songs/title` endpoint.
  On success it shows a single result and sets `total` and `totalPages` to 1.
  On failure it shows friendly error messages without crashing the UI.

- `handleDownloadAllSongs()`
  Uses `getAllSongs` and `downloadCSV` to export all records as CSV.

- `setSearchTitle()` with an effect that watches `searchTitle`
  When the search box is cleared (value becomes empty), the hook:

  - Clears any existing search error.
  - Reloads page 1 from the `/songs` endpoint.
    This makes the search behavior intuitive without needing a separate reset button.

This pattern keeps the data fetching and state transitions in one place, while the UI components are simple and reusable.

---

### 5. Routing and Layout

The React entry `App.js` configures routing:

- Uses `createBrowserRouter` and `RouterProvider`.
- Routes:

  - `/`

    - `AppLayout` provides the page frame and shared layout.
    - Inside it, `Dashboard` is rendered as a child route.

- `Dashboard` is lazy loaded with `React.lazy` and wrapped in `Suspense` so that:

  - The user sees a small loading message while the JavaScript chunk is being fetched.
  - Initial load time is improved for other routes if the app grows.

`AppLayout` is responsible for the outer shell (background, centering, padding) and contains a `React Router <Outlet />` where the current page is rendered.

`Dashboard` is the container for the song analytics experience. It wires `useSongsPage` to the presentational components:

- `AppHeader`
- `SummaryPanel`
- `SongSectionHeader`
- `SongSearchBar`
- `SongsTable`
- `Pagination`

---

## 📂 Project Structure

_Representative structure as used in the assignment:_

```text
SongAnalytics/
├── backend/
│   ├── app.py                  # Entry point that calls create_app()
│   ├── data/
│   │   └── playlist.json       # Raw column oriented dataset
│   ├── src/
│   │   ├── __init__.py         # App factory and blueprint registration
│   │   ├── routes.py           # Flask Blueprint with /songs endpoints
│   │   ├── services.py         # Business logic, pagination, indexing
│   │   └── normalize.py        # JSON loading and normalization helpers
│   └── tests/
│       ├── conftest.py         # Pytest fixtures for app and client
│       └── test_songs_endpoints.py  # Integration tests for the API
│
└── frontend/
    ├── index.html              # HTML shell with root div
    ├── index.js                # React bootstrapping (ReactDOM.createRoot)
    ├── postcss.config.mjs      # Tailwind v4 and PostCSS config
    ├── src/
    │   ├── App.js              # Router configuration
    │   ├── components/
    │   │   ├── AppLayout.js
    │   │   ├── Dashboard.js
    │   │   ├── AppHeader.js
    │   │   ├── SummaryPanel.js
    │   │   ├── SongSectionHeader.js
    │   │   ├── SongSearchBar.js
    │   │   ├── SongsTable.js
    │   │   ├── Pagination.js
    │   │
    │   ├── hooks/
    │   │   └── useSongsPage.js
    │   ├── api/
    │   │   ├── apiUrl.js
    │   │   ├── getSongsPage.js
    │   │   ├── getAllSongs.js
    │   │   └── getSongByTitle.js
    │   ├── utils/
    │   │   └── downloadCSV.js
    │   └── index.css           # Tailwind entry and custom styles
    └── package.json            # React, Parcel, Tailwind dependencies
```

---

## 🔍 Backend File Responsibilities

- `backend/app.py`

  - Creates the Flask app using the factory from `src.__init__`.
  - Runs the app in development mode.

- `backend/src/__init__.py`

  - Defines `create_app()`.
  - Loads and normalizes the dataset.
  - Builds the `title_index`.
  - Registers the `songs` blueprint.

- `backend/src/normalize.py`

  - Responsible for converting the column oriented JSON into a list of row objects.
  - Provides helpers `load_raw_json` and `normalize`.

- `backend/src/services.py`

  - `paginate_songs(items, page, size)` - shared pagination logic.
  - Any future business logic such as filtering, statistics or caching utilities.

- `backend/src/routes.py`

  - Defines HTTP handlers:

    - `GET /songs` for paginated list.
    - `GET /songs/all` for full dataset.
    - `GET /songs/title` for lookup by title.

  - Handles query parameter parsing and error responses.

- `backend/tests/conftest.py`

  - Pytest fixtures that create a test app and a test client, so tests do not need to know about the app configuration.

- `backend/tests/test_songs_endpoints.py`

  - Verifies that:

    - Pagination works as expected.
    - Page clamping behavior is correct.
    - `/songs/all` returns the complete list.
    - `/songs/title` handles success, missing parameter, empty title, and not found cases.

---

## 💻 Frontend File Responsibilities

- `frontend/src/App.js`

  - Configures the React Router and lazy loads `Dashboard`.
  - Wraps everything in `RouterProvider`.

- `frontend/src/components/AppLayout.js`

  - Top level layout shell.
  - Provides consistent page background and container.
  - Renders the matched route through `<Outlet />`.

- `frontend/src/components/Dashboard.js`

  - Feature container for the song analytics page.
  - Calls `useSongsPage` to get state and actions.
  - Composes the header, summary panel, search bar, song table and pagination.

- `frontend/src/hooks/useSongsPage.js`

  - Manages all state related to songs, pagination, search, sorting and analytics.
  - Uses API helpers to call the Flask backend.
  - Implements "clear search box to reset view" behavior.

- `frontend/src/components/AppHeader.js`

  - Visual header for the dashboard (title and optional description).

- `frontend/src/components/SummaryPanel.js`

  - Displays dataset level information such as total row count and attribute names.
  - Derives these from `allSongs` so it stays data driven.

- `frontend/src/components/SongSectionHeader.js`

  - Shows "Showing X result(s) from Y total records."
  - Exposes "Download CSV" action.

- `frontend/src/components/SongSearchBar.js`

  - Pure input component.
  - Controlled by `searchTitle` and `setSearchTitle`.
  - Calls `onSearch` when the "Get Song" button is clicked.
  - Displays error messages.

- `frontend/src/components/SongsTable.js`

  - Renders the tabular view of songs.
  - Supports click to sort on header columns based on `sortField` and `sortOrder`.
  - Displays a "No songs found" state when the list is empty.

- `frontend/src/components/Pagination.js`

  - Renders "Previous" and "Next" buttons and "Page X of Y".
  - Uses the `totalPages` from backend metadata.
  - Disables buttons appropriately.

- `frontend/src/api/*.js`

  - Small wrappers around `fetch`:

    - `getSongsPage(page, size)`
    - `getAllSongs()`
    - `getSongByTitle(title)`

  - Use the shared `API_URL` constant to avoid hard coded URLs.

- `frontend/src/utils/downloadCSV.js`

  - Converts an array of song objects into CSV text.
  - Uses a Blob and a temporary anchor element to trigger a file download in the browser.

---

## ⚡ Getting Started

### Prerequisites

- Python 3.10 or later
- Node.js 18 or later
- npm

The API will be available at:

```text
http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Parcel will start a dev server, usually at:

```text
http://localhost:1234
```

Make sure the frontend `API_URL` constant points to your backend base URL.

---

## 📡 API Reference

| Method | Endpoint       | Description                    | Query Params       |
| ------ | -------------- | ------------------------------ | ------------------ |
| GET    | `/songs/all`   | Returns the full dataset       | None               |
| GET    | `/songs`       | Returns a paginated list       | `page`, `size`     |
| GET    | `/songs/title` | Returns a single song by title | `title` (required) |

Response examples:

- `GET /songs?page=1&size=10` returns the pagination object described above.
- `GET /songs/title?title=3AM` returns a single song object or a 404 JSON error.

---

## ✅ Testing

To run the backend test suite:

```bash
cd backend
python -m pytest
```

Current coverage focuses on:

- Pagination behavior and metadata.
- All API endpoints including edge cases and error paths.

---

## 🔮 Future Extensions

Potential next steps if this were a production system:

- Replace in memory storage with a relational or document database and use proper indexes.
- Implement filtering by numeric ranges (tempo, danceability).
- Add authentication for write operations and administrative analytics.
- Introduce type checked schemas for the API responses using pydantic or similar libraries.
- Add automated frontend tests using a modern testing stack such as Vitest and React Testing Library to cover core flows like search, pagination, sorting, and CSV export.

This README is intended to serve as the technical documentation for the project and to demonstrate end to end ownership of a small but complete full stack application.
