"""
Integration tests for the songs API endpoints.

Covers:
- GET /songs pagination with default and custom page/size
- Page clamping behavior for values below 1 and above the last page
- GET /songs/all returning the full dataset as a plain list
- GET /songs/title successful lookup (case insensitive)
- GET /songs/title error handling for:
  - missing title parameter
  - empty title after trimming whitespace
  - non existing title
"""
def test_get_songs_page_default(client):
    # When no query params are passed, should return page 1, size 10
    resp = client.get("/songs")
    assert resp.status_code == 200

    data = resp.get_json()
    assert data["page"] == 1
    assert data["size"] == 10
    assert "songs" in data
    assert "total" in data
    assert "total_pages" in data

    # With the provided dataset there are 100 rows, page size 10
    assert data["total"] == 100
    assert len(data["songs"]) == 10


def test_get_songs_page_custom_page_and_size(client):
    resp = client.get("/songs?page=2&size=5")
    assert resp.status_code == 200

    data = resp.get_json()
    assert data["page"] == 2
    assert data["size"] == 5
    assert len(data["songs"]) == 5
    assert data["total"] == 100
    assert data["total_pages"] == 20


def test_get_songs_page_invalid_page_is_clamped(client):
    # page 0 should be clamped up to page 1 by paginate_songs
    resp = client.get("/songs?page=0&size=10")
    assert resp.status_code == 200

    data = resp.get_json()
    assert data["page"] == 1
    assert len(data["songs"]) == 10


def test_get_songs_page_huge_page_is_clamped_to_last(client):
    resp = client.get("/songs?page=999&size=10")
    assert resp.status_code == 200

    data = resp.get_json()
    # With 100 items and size 10, last page is 10
    assert data["page"] == data["total_pages"] == 10
    assert len(data["songs"]) == 10


def test_get_all_songs_returns_full_list(client):
    resp = client.get("/songs/all")
    assert resp.status_code == 200

    data = resp.get_json()
    # Endpoint returns a plain list, not wrapped
    assert isinstance(data, list)
    assert len(data) == 100

    # Each element should at least have a title
    assert "title" in data[0]


def test_get_song_by_title_success(client):
    # The playlist.json has a song titled "3AM" at index 0
    resp = client.get("/songs/title?title=3AM")
    assert resp.status_code == 200

    song = resp.get_json()
    assert song["title"] == "3AM"

    # Case insensitivity
    resp2 = client.get("/songs/title?title=3am")
    assert resp2.status_code == 200
    song2 = resp2.get_json()
    assert song2["title"] == "3AM"


def test_get_song_by_title_missing_param(client):
    resp = client.get("/songs/title")
    assert resp.status_code == 400

    data = resp.get_json()
    assert "error" in data
    assert "title query parameter is required" in data["error"]


def test_get_song_by_title_empty_string(client):
    resp = client.get("/songs/title?title=   ")
    assert resp.status_code == 400

    data = resp.get_json()
    assert "error" in data
    assert "title cannot be empty" in data["error"]


def test_get_song_by_title_not_found(client):
    resp = client.get("/songs/title?title=THIS_DOES_NOT_EXIST")
    assert resp.status_code == 404

    data = resp.get_json()
    assert "error" in data
    assert "Song not found" in data["error"]
