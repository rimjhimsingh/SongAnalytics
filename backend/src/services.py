"""
Services Module
---------------
This module contains the core "Business Logic" of the application.
It acts as the intermediary between the raw data (JSON file) and the 
web layer (Routes).

Responsibilities:
1. Data Ingestion: Loading and normalizing the dataset at startup.
2. Indexing: Creating efficient lookup structures (Hash Maps) for fast searching.
3. Logic: Handling calculations like pagination algorithms.

By separating this logic from 'routes.py', we ensure that the API layer 
stays thin and focused only on HTTP mechanics.
"""
import math
import os

from .normalize import load_raw_json, normalize


# Resolve dataset path relative to project root
_BASE_DIR = os.path.dirname(os.path.dirname(__file__))
_DATA_PATH = os.path.join(_BASE_DIR, "data", "playlist.json")


def load_dataset():
    """
    Perform the ETL (Extract, Transform, Load) process for the application.

    This function:
    1. Loads the raw JSON file from disk.
    2. Normalizes it into a list of dictionaries.
    3. Builds an in-memory Hash Map (Index) for O(1) title lookups.

    Returns:
        tuple: A tuple containing:
            - normalized_data (list): The full list of song objects.
            - title_index (dict): A mapping of {casefolded_title: song_object}.
    """
    raw_data = load_raw_json(_DATA_PATH)
    normalized_data = normalize(raw_data)

    title_index = {}
    
    # We pre-compute this index now so user requests are instant.
    for song in normalized_data:
        title = song.get("title")
        if not title:
            continue
        key = title.casefold() # Normalization for Case-Insensitive Search
        # Handling Duplicates: keep first occurrence for a given title
        title_index.setdefault(key, song)

    return normalized_data, title_index


# Increases startup time slightly, but subsequent API requests are very fast because data is already in RAM
songs_data, title_index = load_dataset()


def paginate_songs(items, page, size):
    """
    Apply pagination logic to a dataset.

    Args:
        items (list): The source list of data to paginate.
        page (int): The requested page number.
        size (int): The number of items per page.

    Returns:
        dict: A dictionary containing the sliced data and pagination metadata
              (total_pages, current_page, etc.) used by the frontend.
    """
    if size is None or size <= 0:
        size = 10

    total_items = len(items)
    total_pages = math.ceil(total_items / size) if size > 0 else 1 # math.ceil ensures we don't drop the last partial page of data

    # clamp page into valid range
    if page is None or page < 1: # Ensure page is at least 1
        page = 1
    if total_pages > 0 and page > total_pages:
        page = total_pages

    # Calculate the start and end indices for the Python list slice
    start = (page - 1) * size
    end = start + size
    page_data = items[start:end]

    return {
        "page": page,
        "size": size,
        "total": total_items,
        "total_pages": total_pages,
        "songs": page_data,
    }
