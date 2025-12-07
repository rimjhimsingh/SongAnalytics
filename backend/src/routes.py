"""
Routes Module
-------------
This module defines the HTTP endpoints (routes) for the Songs API.
It uses a Flask Blueprint to group these routes, making the application 
modular and easier to register in the main app factory.

Responsibilities:
1. Handle incoming HTTP requests.
2. Parse and validate query parameters (page, size, title).
3. Delegate business logic to the service layer.
4. Return standardized JSON responses and HTTP status codes.
"""
from flask import Blueprint, request, jsonify

from .services import songs_data, title_index, paginate_songs

main_bp = Blueprint("main", __name__)

@main_bp.route("/", methods=["GET"])
def health_check():
    
    return jsonify({
        "status": "online",
        "message": "Song Analytics API is running",
        "version": "1.0.0"
    })

# Create a Blueprint named 'songs'. This groups all song-related URLs under one namespace.
songs_bp = Blueprint("songs", __name__)


@songs_bp.route("/songs/all", methods=["GET"])
def get_all_songs():
    """
    Retrieve the entire dataset of songs.

    Returns:
        JSON: A list of all song objects.
        200 OK
    """
    return jsonify(songs_data)


@songs_bp.route("/songs", methods=["GET"])
def get_songs_page():
    """
    Retrieve a specific page of songs (Pagination).

    Query Parameters:
        page (int): The page number to retrieve (default: 1).
        size (int): The number of items per page (default: 10).

    Returns:
        JSON: A dictionary containing metadata (total items, total pages) 
              and the list of songs for the requested page.
        200 OK
    """
    
    #type=int automatically casts the string; if it fails, Flask handles the error. Default values ensure the API works even if params are missing
    page = request.args.get("page", default=1, type=int) 
    size = request.args.get("size", default=10, type=int)

    response = paginate_songs(songs_data, page, size)
    return jsonify(response)


@songs_bp.route("/songs/title", methods=["GET"])
def get_song_by_title():
    """
    Search for a single song by its title (Exact Match, Case-Insensitive).

    Query Parameters:
        title (str): The title of the song to search for.

    Returns:
        JSON: The song object if found.
        400 Bad Request: If the 'title' parameter is missing or empty.
        404 Not Found: If no song matches the provided title.
        200 OK: If the song is found.
    """
    
    raw_title = request.args.get("title")

    if raw_title is None:
        return jsonify({"error": "title query parameter is required"}), 400

    user_title = raw_title.strip()
    if not user_title:
        return jsonify({"error": "title cannot be empty"}), 400

    key = user_title.casefold()
    song = title_index.get(key) #constant lookup

    if song is None:
        return jsonify({"error": "Song not found"}), 404

    return jsonify(song)
